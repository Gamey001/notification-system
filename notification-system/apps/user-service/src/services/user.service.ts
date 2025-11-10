import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user.entity";
import { UserPreference } from "../entities/user-preference.entity";
import { DeviceToken } from "../entities/device-token.entity";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { UpdatePreferenceDto } from "../dto/update-preference.dto";
import { CreateDeviceTokenDto } from "../dto/create-device-token.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPreference)
    private preferenceRepository: Repository<UserPreference>,
    @InjectRepository(DeviceToken)
    private deviceTokenRepository: Repository<DeviceToken>
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Create default preferences
    const preference = this.preferenceRepository.create({
      user_id: savedUser.id,
      email_notifications_enabled: true,
      push_notifications_enabled: true,
      marketing_emails_enabled: true,
      preferred_language: "en",
      timezone: "UTC",
    });

    await this.preferenceRepository.save(preference);

    return savedUser;
  }

  async login(loginDto: LoginDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.is_active) {
      throw new UnauthorizedException("Account is deactivated");
    }

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["preference", "device_tokens"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["preference"],
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async updatePreferences(
    userId: string,
    updatePreferenceDto: UpdatePreferenceDto
  ): Promise<UserPreference> {
    let preference = await this.preferenceRepository.findOne({
      where: { user_id: userId },
    });

    if (!preference) {
      preference = this.preferenceRepository.create({
        user_id: userId,
        ...updatePreferenceDto,
      });
    } else {
      Object.assign(preference, updatePreferenceDto);
    }

    return this.preferenceRepository.save(preference);
  }

  async addDeviceToken(
    userId: string,
    createDeviceTokenDto: CreateDeviceTokenDto
  ): Promise<DeviceToken> {
    // Check if user exists
    const user = await this.findById(userId);

    // Check if token already exists
    const existingToken = await this.deviceTokenRepository.findOne({
      where: {
        user_id: userId,
        token: createDeviceTokenDto.token,
      },
    });

    if (existingToken) {
      // Update existing token
      existingToken.is_active = true;
      existingToken.last_used_at = new Date();
      existingToken.device_name =
        createDeviceTokenDto.device_name || existingToken.device_name;
      return this.deviceTokenRepository.save(existingToken);
    }

    // Create new token
    const deviceToken = this.deviceTokenRepository.create({
      user_id: userId,
      ...createDeviceTokenDto,
      last_used_at: new Date(),
    });

    return this.deviceTokenRepository.save(deviceToken);
  }

  async getDeviceTokens(userId: string): Promise<DeviceToken[]> {
    return this.deviceTokenRepository.find({
      where: { user_id: userId, is_active: true },
    });
  }

  async removeDeviceToken(userId: string, tokenId: string): Promise<void> {
    const token = await this.deviceTokenRepository.findOne({
      where: { id: tokenId, user_id: userId },
    });

    if (!token) {
      throw new NotFoundException("Device token not found");
    }

    token.is_active = false;
    await this.deviceTokenRepository.save(token);
  }
}
