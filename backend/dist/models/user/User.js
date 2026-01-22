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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Import related models
const Listing_1 = require("../listing/Listing");
const Deck_1 = require("../deck/Deck");
const Follow_1 = require("../social/Follow");
const Message_1 = require("../social/Message");
const Post_1 = require("../social/Post");
const Event_1 = require("../event/Event");
const Notification_1 = require("../Notification");
let User = class User extends sequelize_typescript_1.Model {
    // Virtual fields
    get tradingStats() {
        return {
            totalTrades: this.totalTrades,
            sellerRating: parseFloat(this.sellerRating.toString()),
            reviewCount: this.reviewCount,
            successfulTrades: this.successfulTrades,
        };
    }
    // Instance methods
    async comparePassword(candidatePassword) {
        return await bcryptjs_1.default.compare(candidatePassword, this.password);
    }
    getPublicProfile() {
        return {
            id: this.id,
            username: this.username,
            displayName: this.displayName,
            avatarUrl: this.avatarUrl,
            bio: this.bio,
            location: this.location,
            isVerified: this.isVerified,
            tradingStats: this.tradingStats,
            memberSince: this.createdAt,
        };
    }
    // Hooks
    static async hashPassword(instance) {
        if (instance.changed('password')) {
            const salt = await bcryptjs_1.default.genSalt(12);
            instance.password = await bcryptjs_1.default.hash(instance.password, salt);
        }
    }
};
exports.User = User;
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(50)),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(100)),
    __metadata("design:type", String)
], User.prototype, "displayName", void 0);
__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500)),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], User.prototype, "location", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('user'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('user', 'moderator', 'admin', 'store_owner')),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], User.prototype, "totalTrades", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(3, 2)),
    __metadata("design:type", Number)
], User.prototype, "sellerRating", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], User.prototype, "reviewCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], User.prototype, "successfulTrades", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], User.prototype, "preferences", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(45)),
    __metadata("design:type", String)
], User.prototype, "lastLoginIp", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Listing_1.Listing, 'sellerId'),
    __metadata("design:type", Array)
], User.prototype, "listings", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Deck_1.Deck, 'userId'),
    __metadata("design:type", Array)
], User.prototype, "decks", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Post_1.Post, 'authorId'),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Message_1.Message, 'senderId'),
    __metadata("design:type", Array)
], User.prototype, "sentMessages", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Message_1.Message, 'recipientId'),
    __metadata("design:type", Array)
], User.prototype, "receivedMessages", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Event_1.Event, 'organizerId'),
    __metadata("design:type", Array)
], User.prototype, "organizedEvents", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Notification_1.Notification, 'userId'),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => User, () => Follow_1.Follow, 'followerId', 'followingId'),
    __metadata("design:type", Array)
], User.prototype, "following", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => User, () => Follow_1.Follow, 'followingId', 'followerId'),
    __metadata("design:type", Array)
], User.prototype, "followers", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hashPassword", null);
exports.User = User = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'users',
        timestamps: true,
        paranoid: true,
    })
], User);
//# sourceMappingURL=User.js.map