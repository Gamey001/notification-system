import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum DeviceType {
  IOS = "ios",
  ANDROID = "android",
  WEB = "web",
}

@Entity("device_tokens")
export class DeviceToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  user_id: string;

  @Column({ type: "text" })
  token: string;

  @Column({
    type: "enum",
    enum: DeviceType,
  })
  device_type: DeviceType;

  @Column({ type: "varchar", nullable: true })
  device_name: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: "timestamp", nullable: true })
  last_used_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.device_tokens)
  @JoinColumn({ name: "user_id" })
  user: User;
}
