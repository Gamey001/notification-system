import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Template } from "./template.entity";

@Entity("template_versions")
export class TemplateVersion {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  template_id: string;

  @Column({ type: "int" })
  version_number: number;

  @Column({ type: "varchar", default: "en" })
  language: string;

  @Column({ type: "varchar", nullable: true })
  subject: string; // For email templates

  @Column({ type: "text" })
  content: string;

  @Column({ type: "text", nullable: true })
  html_content: string; // For email templates

  @Column({ type: "json", nullable: true })
  variables: string[]; // List of available variables

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @Column({ default: false })
  is_current: boolean;

  @Column({ type: "varchar", nullable: true })
  created_by: string;

  @Column({ type: "text", nullable: true })
  change_notes: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Template, (template) => template.versions)
  @JoinColumn({ name: "template_id" })
  template: Template;
}
