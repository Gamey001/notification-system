import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { UpdatePreferenceDto } from "../dto/update-preference.dto";
import { CreateDeviceTokenDto } from "../dto/create-device-token.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "../dto/user-response.dto";

@Controller("users")
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.userService.register(registerDto);
    const token = await this.authService.generateToken(user);

    return {
      success: true,
      message: "User registered successfully",
      data: {
        user: plainToInstance(UserResponseDto, user),
        access_token: token,
      },
    };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.login(loginDto);
    const token = await this.authService.generateToken(user);

    return {
      success: true,
      message: "Login successful",
      data: {
        user: plainToInstance(UserResponseDto, user),
        access_token: token,
      },
    };
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getUser(@Param("id") id: string) {
    const user = await this.userService.findById(id);

    return {
      success: true,
      message: "User retrieved successfully",
      data: plainToInstance(UserResponseDto, user),
    };
  }

  @Patch(":id/preferences")
  @UseGuards(JwtAuthGuard)
  async updatePreferences(
    @Param("id") id: string,
    @Body() updatePreferenceDto: UpdatePreferenceDto,
    @Request() req
  ) {
    // Ensure user can only update their own preferences
    if (req.user.id !== id) {
      return {
        success: false,
        message: "Unauthorized",
        error: "You can only update your own preferences",
      };
    }

    const preference = await this.userService.updatePreferences(
      id,
      updatePreferenceDto
    );

    return {
      success: true,
      message: "Preferences updated successfully",
      data: preference,
    };
  }

  @Post(":id/device-tokens")
  @UseGuards(JwtAuthGuard)
  async addDeviceToken(
    @Param("id") id: string,
    @Body() createDeviceTokenDto: CreateDeviceTokenDto,
    @Request() req
  ) {
    // Ensure user can only add tokens to their own account
    if (req.user.id !== id) {
      return {
        success: false,
        message: "Unauthorized",
        error: "You can only add device tokens to your own account",
      };
    }

    const deviceToken = await this.userService.addDeviceToken(
      id,
      createDeviceTokenDto
    );

    return {
      success: true,
      message: "Device token added successfully",
      data: deviceToken,
    };
  }

  @Get(":id/device-tokens")
  @UseGuards(JwtAuthGuard)
  async getDeviceTokens(@Param("id") id: string, @Request() req) {
    if (req.user.id !== id) {
      return {
        success: false,
        message: "Unauthorized",
        error: "You can only view your own device tokens",
      };
    }

    const tokens = await this.userService.getDeviceTokens(id);

    return {
      success: true,
      message: "Device tokens retrieved successfully",
      data: tokens,
    };
  }

  @Get("health")
  healthCheck() {
    return {
      success: true,
      message: "User service is healthy",
      data: {
        status: "ok",
        timestamp: new Date().toISOString(),
      },
    };
  }
}
