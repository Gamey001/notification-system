import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { UpdatePreferenceDto } from "../dto/update-preference.dto";
import { CreateDeviceTokenDto } from "../dto/create-device-token.dto";
import { UserResponseDto } from "../dto/user-response.dto";
export declare class UserController {
    private userService;
    private authService;
    constructor(userService: UserService, authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: UserResponseDto;
            access_token: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: UserResponseDto;
            access_token: string;
        };
    }>;
    getUser(id: string): Promise<{
        success: boolean;
        message: string;
        data: UserResponseDto;
    }>;
    updatePreferences(id: string, updatePreferenceDto: UpdatePreferenceDto, req: any): Promise<{
        success: boolean;
        message: string;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: import("../entities/user-preference.entity").UserPreference;
        error?: undefined;
    }>;
    addDeviceToken(id: string, createDeviceTokenDto: CreateDeviceTokenDto, req: any): Promise<{
        success: boolean;
        message: string;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: import("../entities/device-token.entity").DeviceToken;
        error?: undefined;
    }>;
    getDeviceTokens(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: import("../entities/device-token.entity").DeviceToken[];
        error?: undefined;
    }>;
    healthCheck(): {
        success: boolean;
        message: string;
        data: {
            status: string;
            timestamp: string;
        };
    };
}
