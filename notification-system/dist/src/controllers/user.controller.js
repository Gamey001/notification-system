"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const auth_service_1 = require("../services/auth.service");
const register_dto_1 = require("../dto/register.dto");
const login_dto_1 = require("../dto/login.dto");
const update_preference_dto_1 = require("../dto/update-preference.dto");
const create_device_token_dto_1 = require("../dto/create-device-token.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const class_transformer_1 = require("class-transformer");
const user_response_dto_1 = require("../dto/user-response.dto");
let UserController = class UserController {
    userService;
    authService;
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async register(registerDto) {
        const user = await this.userService.register(registerDto);
        const token = await this.authService.generateToken(user);
        return {
            success: true,
            message: "User registered successfully",
            data: {
                user: (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user),
                access_token: token,
            },
        };
    }
    async login(loginDto) {
        const user = await this.userService.login(loginDto);
        const token = await this.authService.generateToken(user);
        return {
            success: true,
            message: "Login successful",
            data: {
                user: (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user),
                access_token: token,
            },
        };
    }
    async getUser(id) {
        const user = await this.userService.findById(id);
        return {
            success: true,
            message: "User retrieved successfully",
            data: (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user),
        };
    }
    async updatePreferences(id, updatePreferenceDto, req) {
        if (req.user.id !== id) {
            return {
                success: false,
                message: "Unauthorized",
                error: "You can only update your own preferences",
            };
        }
        const preference = await this.userService.updatePreferences(id, updatePreferenceDto);
        return {
            success: true,
            message: "Preferences updated successfully",
            data: preference,
        };
    }
    async addDeviceToken(id, createDeviceTokenDto, req) {
        if (req.user.id !== id) {
            return {
                success: false,
                message: "Unauthorized",
                error: "You can only add device tokens to your own account",
            };
        }
        const deviceToken = await this.userService.addDeviceToken(id, createDeviceTokenDto);
        return {
            success: true,
            message: "Device token added successfully",
            data: deviceToken,
        };
    }
    async getDeviceTokens(id, req) {
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
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)("register"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Patch)(":id/preferences"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_preference_dto_1.UpdatePreferenceDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePreferences", null);
__decorate([
    (0, common_1.Post)(":id/device-tokens"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_device_token_dto_1.CreateDeviceTokenDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addDeviceToken", null);
__decorate([
    (0, common_1.Get)(":id/device-tokens"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDeviceTokens", null);
__decorate([
    (0, common_1.Get)("health"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "healthCheck", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
//# sourceMappingURL=user.controller.js.map