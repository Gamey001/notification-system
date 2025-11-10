import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Exclude } from "class-transformer";
import { UserPreference } from "./user-preference.entity";
import { DeviceToken } from "./device-token.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: "varchar", nullable: true })
  phone_number: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => UserPreference, (preference) => preference.user, {
    cascade: true,
  })
  preference: UserPreference;

  @OneToMany(() => DeviceToken, (token) => token.user, { cascade: true })
  device_tokens: DeviceToken[];
}
