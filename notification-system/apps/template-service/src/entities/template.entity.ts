import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { TemplateVersion } from "./template-version.entity";

export enum TemplateType {
  EMAIL = "email",
  PUSH = "push",
  SMS = "sms",
}

export enum TemplateStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  ARCHIVED = "archived",
}

@Entity("templates")
export class Template {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: TemplateType,
  })
  type: TemplateType;

  @Column({
    type: "enum",
    enum: TemplateStatus,
    default: TemplateStatus.DRAFT,
  })
  status: TemplateStatus;

  @Column({ type: "varchar", nullable: true })
  category: string;

  @Column({ type: "json", nullable: true })
  tags: string[];

  @Column({ type: "uuid", nullable: true })
  current_version_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => TemplateVersion, (version) => version.template, {
    cascade: true,
  })
  versions: TemplateVersion[];
}
