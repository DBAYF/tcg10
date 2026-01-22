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
exports.Card = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let Card = class Card extends sequelize_typescript_1.Model {
    // Virtual computed properties
    get fullName() {
        return `${this.name} (${this.setId} ${this.number})`;
    }
    get displayRarity() {
        return this.rarity.replace('_', ' ').toUpperCase();
    }
};
exports.Card = Card;
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('pokemon', 'mtg', 'yugioh', 'lorcana', 'one_piece')),
    __metadata("design:type", String)
], Card.prototype, "gameId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Card.prototype, "setId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], Card.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(10)),
    __metadata("design:type", String)
], Card.prototype, "number", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('common', 'uncommon', 'rare', 'holo_rare', 'super_rare', 'secret_rare', 'mythic_rare', 'legendary', 'ultra_rare')),
    __metadata("design:type", String)
], Card.prototype, "rarity", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(500)),
    __metadata("design:type", String)
], Card.prototype, "imageUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Card.prototype, "rulesText", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL(10, 2)),
    __metadata("design:type", Number)
], Card.prototype, "marketPrice", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], Card.prototype, "attributes", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Array)
], Card.prototype, "relatedCards", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Card.prototype, "isActive", void 0);
exports.Card = Card = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'cards',
        timestamps: true,
        indexes: [
            { fields: ['setId'] },
            { fields: ['name'] },
            { fields: ['number'] },
            { fields: ['rarity'] },
            { fields: ['gameId'] },
        ],
    })
], Card);
//# sourceMappingURL=Card.js.map