import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { TemplateService } from "../services/template.service";
import { TemplateRendererService } from "../services/template-renderer.service";
import { CreateTemplateDto } from "../dto/create-template.dto";
import { UpdateTemplateDto } from "../dto/update-template.dto";
import { CreateVersionDto } from "../dto/create-version.dto";
import { RenderTemplateDto } from "../dto/render-template.dto";
import { TemplateQueryDto } from "../dto/template-query.dto";

@Controller("templates")
export class TemplateController {
  constructor(
    private templateService: TemplateService,
    private rendererService: TemplateRendererService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    const template = await this.templateService.create(createTemplateDto);

    return {
      success: true,
      message: "Template created successfully",
      data: template,
    };
  }

  @Get()
  async findAll(@Query() query: TemplateQueryDto) {
    const result = await this.templateService.findAll(query);

    return {
      success: true,
      message: "Templates retrieved successfully",
      data: result.templates,
      meta: result.meta,
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const template = await this.templateService.findById(id);

    return {
      success: true,
      message: "Template retrieved successfully",
      data: template,
    };
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateTemplateDto: UpdateTemplateDto
  ) {
    const template = await this.templateService.update(id, updateTemplateDto);

    return {
      success: true,
      message: "Template updated successfully",
      data: template,
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async delete(@Param("id") id: string) {
    await this.templateService.delete(id);

    return {
      success: true,
      message: "Template deleted successfully",
    };
  }

  @Post(":id/versions")
  @HttpCode(HttpStatus.CREATED)
  async createVersion(
    @Param("id") id: string,
    @Body() createVersionDto: CreateVersionDto
  ) {
    const version = await this.templateService.createVersion(
      id,
      createVersionDto
    );

    return {
      success: true,
      message: "Template version created successfully",
      data: version,
    };
  }

  @Get(":id/versions")
  async getVersions(@Param("id") id: string) {
    const versions = await this.templateService.getVersions(id);

    return {
      success: true,
      message: "Template versions retrieved successfully",
      data: versions,
    };
  }

  @Get(":id/versions/:version_id")
  async getVersion(
    @Param("id") id: string,
    @Param("version_id") versionId: string
  ) {
    const version = await this.templateService.getVersion(id, versionId);

    return {
      success: true,
      message: "Template version retrieved successfully",
      data: version,
    };
  }

  @Patch(":id/versions/:version_id/set-current")
  async setCurrentVersion(
    @Param("id") id: string,
    @Param("version_id") versionId: string
  ) {
    const version = await this.templateService.setCurrentVersion(id, versionId);

    return {
      success: true,
      message: "Current version updated successfully",
      data: version,
    };
  }

  @Post(":id/render")
  async render(@Param("id") id: string, @Body() renderDto: RenderTemplateDto) {
    const version = await this.templateService.getCurrentVersion(
      id,
      renderDto.language
    );

    const result = this.rendererService.renderWithValidation(
      version.content,
      renderDto.variables
    );

    let htmlRendered = "";
    if (version.html_content) {
      htmlRendered = this.rendererService.render(
        version.html_content,
        renderDto.variables
      );
    }

    return {
      success: true,
      message: "Template rendered successfully",
      data: {
        template_id: id,
        version_id: version.id,
        version_number: version.version_number,
        subject: version.subject,
        content: result.rendered,
        html_content: htmlRendered,
        validation: result.validation,
      },
    };
  }

  @Get("health")
  healthCheck() {
    return {
      success: true,
      message: "Template service is healthy",
      data: {
        status: "ok",
        timestamp: new Date().toISOString(),
      },
    };
  }
}
