import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("user_preferences")
export class UserPreference {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  user_id: string;

  @Column({ default: true })
  email_notifications_enabled: boolean;

  @Column({ default: true })
  push_notifications_enabled: boolean;

  @Column({ default: true })
  marketing_emails_enabled: boolean;

  @Column({ type: "varchar", default: "en" })
  preferred_language: string;

  @Column({ type: "varchar", default: "UTC" })
  timezone: string;

  @Column({ type: "json", nullable: true })
  notification_categories: Record<string, boolean>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.preference)
  @JoinColumn({ name: "user_id" })
  user: User;
}
