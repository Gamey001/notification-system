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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceToken = exports.DeviceType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var DeviceType;
(function (DeviceType) {
    DeviceType["IOS"] = "ios";
    DeviceType["ANDROID"] = "android";
    DeviceType["WEB"] = "web";
})(DeviceType || (exports.DeviceType = DeviceType = {}));
let DeviceToken = class DeviceToken {
    id;
    user_id;
    token;
    device_type;
    device_name;
    is_active;
    last_used_at;
    created_at;
    updated_at;
    user;
};
exports.DeviceToken = DeviceToken;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], DeviceToken.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid"),
    __metadata("design:type", String)
], DeviceToken.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], DeviceToken.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: DeviceType,
    }),
    __metadata("design:type", String)
], DeviceToken.prototype, "device_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], DeviceToken.prototype, "device_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], DeviceToken.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], DeviceToken.prototype, "last_used_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DeviceToken.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DeviceToken.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.device_tokens),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], DeviceToken.prototype, "user", void 0);
exports.DeviceToken = DeviceToken = __decorate([
    (0, typeorm_1.Entity)("device_tokens")
], DeviceToken);
//# sourceMappingURL=device-token.entity.js.map