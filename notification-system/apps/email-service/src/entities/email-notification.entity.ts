import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum EmailStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SENT = "sent",
  FAILED = "failed",
  BOUNCED = "bounced",
}

@Entity("email_notifications")
export class EmailNotification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  correlation_id: string;

  @Column("uuid")
  user_id: string;

  @Column("uuid")
  template_id: string;

  @Column()
  recipient_email: string;

  @Column({ type: "varchar", nullable: true })
  subject: string;

  @Column({ type: "text", nullable: true })
  content: string;

  @Column({ type: "text", nullable: true })
  html_content: string;

  @Column({
    type: "enum",
    enum: EmailStatus,
    default: EmailStatus.PENDING,
  })
  status: EmailStatus;

  @Column({ type: "json", nullable: true })
  variables: Record<string, any>;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @Column({ type: "int", default: 0 })
  retry_count: number;

  @Column({ type: "text", nullable: true })
  error_message: string;

  @Column({ type: "timestamp", nullable: true })
  sent_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
