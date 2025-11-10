"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServiceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const user_entity_1 = require("./entities/user.entity");
const user_preference_entity_1 = require("./entities/user-preference.entity");
const device_token_entity_1 = require("./entities/device-token.entity");
const user_controller_1 = require("./controllers/user.controller");
const user_service_1 = require("./services/user.service");
const auth_service_1 = require("./services/auth.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
let UserServiceModule = class UserServiceModule {
};
exports.UserServiceModule = UserServiceModule;
exports.UserServiceModule = UserServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: "postgres",
                    host: configService.get("DB_HOST", "localhost"),
                    port: configService.get("DB_PORT", 5432),
                    username: configService.get("DB_USERNAME", "postgres"),
                    password: configService.get("DB_PASSWORD", "admin"),
                    database: configService.get("DB_NAME", "notification_system"),
                    entities: [user_entity_1.User, user_preference_entity_1.UserPreference, device_token_entity_1.DeviceToken],
                    synchronize: configService.get("NODE_ENV") !== "production",
                    logging: configService.get("NODE_ENV") === "development",
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, user_preference_entity_1.UserPreference, device_token_entity_1.DeviceToken]),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get("JWT_SECRET", "your-secret-key"),
                    signOptions: {
                        expiresIn: configService.get("JWT_EXPIRES_IN", "7d"),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [user_service_1.UserService, auth_service_1.AuthService],
    })
], UserServiceModule);
//# sourceMappingURL=user-service.module.js.map