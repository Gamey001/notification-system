"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../entities/user.entity");
const user_preference_entity_1 = require("../entities/user-preference.entity");
const device_token_entity_1 = require("../entities/device-token.entity");
let UserService = class UserService {
    userRepository;
    preferenceRepository;
    deviceTokenRepository;
    constructor(userRepository, preferenceRepository, deviceTokenRepository) {
        this.userRepository = userRepository;
        this.preferenceRepository = preferenceRepository;
        this.deviceTokenRepository = deviceTokenRepository;
    }
    async register(registerDto) {
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException("Email already exists");
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = this.userRepository.create({
            ...registerDto,
            password: hashedPassword,
        });
        const savedUser = await this.userRepository.save(user);
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
    async login(loginDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException("Account is deactivated");
        }
        return user;
    }
    async findById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["preference", "device_tokens"],
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ["preference"],
        });
        if (!user) {
            throw new common_1.NotFoundException("User not found");
        }
        return user;
    }
    async updatePreferences(userId, updatePreferenceDto) {
        let preference = await this.preferenceRepository.findOne({
            where: { user_id: userId },
        });
        if (!preference) {
            preference = this.preferenceRepository.create({
                user_id: userId,
                ...updatePreferenceDto,
            });
        }
        else {
            Object.assign(preference, updatePreferenceDto);
        }
        return this.preferenceRepository.save(preference);
    }
    async addDeviceToken(userId, createDeviceTokenDto) {
        const user = await this.findById(userId);
        const existingToken = await this.deviceTokenRepository.findOne({
            where: {
                user_id: userId,
                token: createDeviceTokenDto.token,
            },
        });
        if (existingToken) {
            existingToken.is_active = true;
            existingToken.last_used_at = new Date();
            existingToken.device_name =
                createDeviceTokenDto.device_name || existingToken.device_name;
            return this.deviceTokenRepository.save(existingToken);
        }
        const deviceToken = this.deviceTokenRepository.create({
            user_id: userId,
            ...createDeviceTokenDto,
            last_used_at: new Date(),
        });
        return this.deviceTokenRepository.save(deviceToken);
    }
    async getDeviceTokens(userId) {
        return this.deviceTokenRepository.find({
            where: { user_id: userId, is_active: true },
        });
    }
    async removeDeviceToken(userId, tokenId) {
        const token = await this.deviceTokenRepository.findOne({
            where: { id: tokenId, user_id: userId },
        });
        if (!token) {
            throw new common_1.NotFoundException("Device token not found");
        }
        token.is_active = false;
        await this.deviceTokenRepository.save(token);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_preference_entity_1.UserPreference)),
    __param(2, (0, typeorm_1.InjectRepository)(device_token_entity_1.DeviceToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map