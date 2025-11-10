import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UserPreference } from "../entities/user-preference.entity";
import { DeviceToken } from "../entities/device-token.entity";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { UpdatePreferenceDto } from "../dto/update-preference.dto";
import { CreateDeviceTokenDto } from "../dto/create-device-token.dto";
export declare class UserService {
    private userRepository;
    private preferenceRepository;
    private deviceTokenRepository;
    constructor(userRepository: Repository<User>, preferenceRepository: Repository<UserPreference>, deviceTokenRepository: Repository<DeviceToken>);
    register(registerDto: RegisterDto): Promise<User>;
    login(loginDto: LoginDto): Promise<User>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    updatePreferences(userId: string, updatePreferenceDto: UpdatePreferenceDto): Promise<UserPreference>;
    addDeviceToken(userId: string, createDeviceTokenDto: CreateDeviceTokenDto): Promise<DeviceToken>;
    getDeviceTokens(userId: string): Promise<DeviceToken[]>;
    removeDeviceToken(userId: string, tokenId: string): Promise<void>;
}
