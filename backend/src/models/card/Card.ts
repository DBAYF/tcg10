import { Table, Column, Model, DataType, AllowNull, Default } from 'sequelize-typescript';
import { CardRarity } from '../../types/shared';

@Table({
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
export class Card extends Model {
  @AllowNull(false)
  @Column(DataType.ENUM('pokemon', 'mtg', 'yugioh', 'lorcana', 'one_piece'))
  gameId!: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  setId!: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  number!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(
    'common',
    'uncommon',
    'rare',
    'holo_rare',
    'super_rare',
    'secret_rare',
    'mythic_rare',
    'legendary',
    'ultra_rare'
  ))
  rarity!: CardRarity;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  imageUrl!: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  rulesText?: string;

  @AllowNull(true)
  @Column(DataType.DECIMAL(10, 2))
  marketPrice?: number;

  @AllowNull(true)
  @Column(DataType.JSON)
  attributes?: Record<string, any>; // Game-specific attributes

  @AllowNull(true)
  @Column(DataType.JSON)
  relatedCards?: string[]; // Evolution chains, alternate versions

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive!: boolean;

  // Virtual computed properties
  get fullName(): string {
    return `${this.name} (${this.setId} ${this.number})`;
  }

  get displayRarity(): string {
    return this.rarity.replace('_', ' ').toUpperCase();
  }
}