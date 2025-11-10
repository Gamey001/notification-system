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
exports.UserPreference = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UserPreference = class UserPreference {
    id;
    user_id;
    email_notifications_enabled;
    push_notifications_enabled;
    marketing_emails_enabled;
    preferred_language;
    timezone;
    notification_categories;
    created_at;
    updated_at;
    user;
};
exports.UserPreference = UserPreference;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserPreference.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid"),
    __metadata("design:type", String)
], UserPreference.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserPreference.prototype, "email_notifications_enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserPreference.prototype, "push_notifications_enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserPreference.prototype, "marketing_emails_enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", default: "en" }),
    __metadata("design:type", String)
], UserPreference.prototype, "preferred_language", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", default: "UTC" }),
    __metadata("design:type", String)
], UserPreference.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: true }),
    __metadata("design:type", Object)
], UserPreference.prototype, "notification_categories", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserPreference.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserPreference.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.preference),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], UserPreference.prototype, "user", void 0);
exports.UserPreference = UserPreference = __decorate([
    (0, typeorm_1.Entity)("user_preferences")
], UserPreference);
//# sourceMappingURL=user-preference.entity.js.map