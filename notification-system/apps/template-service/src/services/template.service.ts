import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like, ILike } from "typeorm";
import { Template, TemplateStatus } from "../entities/template.entity";
import { TemplateVersion } from "../entities/template-version.entity";
import { CreateTemplateDto } from "../dto/create-template.dto";
import { UpdateTemplateDto } from "../dto/update-template.dto";
import { CreateVersionDto } from "../dto/create-version.dto";
import { TemplateQueryDto } from "../dto/template-query.dto";

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    @InjectRepository(TemplateVersion)
    private versionRepository: Repository<TemplateVersion>
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    // Check if template name already exists
    const existing = await this.templateRepository.findOne({
      where: { name: createTemplateDto.name },
    });

    if (existing) {
      throw new ConflictException("Template name already exists");
    }

    // Create template
    const template = this.templateRepository.create({
      name: createTemplateDto.name,
      description: createTemplateDto.description,
      type: createTemplateDto.type,
      category: createTemplateDto.category,
      tags: createTemplateDto.tags,
      status: TemplateStatus.DRAFT,
    });

    const savedTemplate = await this.templateRepository.save(template);

    // Create first version
    const version = this.versionRepository.create({
      template_id: savedTemplate.id,
      version_number: 1,
      language: createTemplateDto.language || "en",
      subject: createTemplateDto.subject,
      content: createTemplateDto.content,
      html_content: createTemplateDto.html_content,
      variables: createTemplateDto.variables || [],
      is_current: true,
    });

    const savedVersion = await this.versionRepository.save(version);

    // Update template with current version
    savedTemplate.current_version_id = savedVersion.id;
    await this.templateRepository.save(savedTemplate);

    return this.findById(savedTemplate.id);
  }

  async findAll(query: TemplateQueryDto) {
    const { type, status, category, search, page = 1, limit = 10 } = query;

    const where: any = {};

    if (type) where.type = type;
    if (status) where.status = status;
    if (category) where.category = category;
    if (search) where.name = ILike(`%${search}%`);

    const [templates, total] = await this.templateRepository.findAndCount({
      where,
      relations: ["versions"],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: "DESC" },
    });

    const total_pages = Math.ceil(total / limit);

    return {
      templates,
      meta: {
        total,
        page,
        limit,
        total_pages,
        has_next: page < total_pages,
        has_previous: page > 1,
      },
    };
  }

  async findById(id: string): Promise<Template> {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: ["versions"],
    });

    if (!template) {
      throw new NotFoundException("Template not found");
    }

    return template;
  }

  async update(
    id: string,
    updateTemplateDto: UpdateTemplateDto
  ): Promise<Template> {
    const template = await this.findById(id);

    if (updateTemplateDto.name && updateTemplateDto.name !== template.name) {
      const existing = await this.templateRepository.findOne({
        where: { name: updateTemplateDto.name },
      });

      if (existing) {
        throw new ConflictException("Template name already exists");
      }
    }

    Object.assign(template, updateTemplateDto);
    await this.templateRepository.save(template);

    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const template = await this.findById(id);
    await this.templateRepository.remove(template);
  }

  async createVersion(
    templateId: string,
    createVersionDto: CreateVersionDto
  ): Promise<TemplateVersion> {
    const template = await this.findById(templateId);

    // Get the latest version number
    const latestVersion = await this.versionRepository.findOne({
      where: { template_id: templateId },
      order: { version_number: "DESC" },
    });

    const newVersionNumber = latestVersion
      ? latestVersion.version_number + 1
      : 1;

    // Set all previous versions as not current
    await this.versionRepository.update(
      { template_id: templateId, is_current: true },
      { is_current: false }
    );

    // Create new version
    const version = this.versionRepository.create({
      template_id: templateId,
      version_number: newVersionNumber,
      language: createVersionDto.language || "en",
      subject: createVersionDto.subject,
      content: createVersionDto.content,
      html_content: createVersionDto.html_content,
      variables: createVersionDto.variables || [],
      change_notes: createVersionDto.change_notes,
      is_current: true,
    });

    const savedVersion = await this.versionRepository.save(version);

    // Update template's current version
    template.current_version_id = savedVersion.id;
    await this.templateRepository.save(template);

    return savedVersion;
  }

  async getVersions(templateId: string): Promise<TemplateVersion[]> {
    await this.findById(templateId); // Verify template exists

    return this.versionRepository.find({
      where: { template_id: templateId },
      order: { version_number: "DESC" },
    });
  }

  async getVersion(
    templateId: string,
    versionId: string
  ): Promise<TemplateVersion> {
    await this.findById(templateId);

    const version = await this.versionRepository.findOne({
      where: { id: versionId, template_id: templateId },
    });

    if (!version) {
      throw new NotFoundException("Version not found");
    }

    return version;
  }

  async getCurrentVersion(
    templateId: string,
    language?: string
  ): Promise<TemplateVersion> {
    await this.findById(templateId);

    const where: any = {
      template_id: templateId,
      is_current: true,
    };

    if (language) {
      where.language = language;
    }

    const version = await this.versionRepository.findOne({ where });

    if (!version) {
      throw new NotFoundException(
        `No current version found${language ? ` for language: ${language}` : ""}`
      );
    }

    return version;
  }

  async setCurrentVersion(
    templateId: string,
    versionId: string
  ): Promise<TemplateVersion> {
    const template = await this.findById(templateId);
    const version = await this.getVersion(templateId, versionId);

    // Set all versions as not current
    await this.versionRepository.update(
      { template_id: templateId, is_current: true },
      { is_current: false }
    );

    // Set selected version as current
    version.is_current = true;
    await this.versionRepository.save(version);

    // Update template
    template.current_version_id = versionId;
    await this.templateRepository.save(template);

    return version;
  }
}
