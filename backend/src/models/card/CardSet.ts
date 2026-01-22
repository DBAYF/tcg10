import { Table, Column, Model, DataType, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'card_sets',
  timestamps: true,
  indexes: [
    { fields: ['gameId'] },
    { fields: ['code'], unique: true },
    { fields: ['releaseDate'] },
  ],
})
export class CardSet extends Model {
  @AllowNull(false)
  @Column(DataType.ENUM('pokemon', 'mtg', 'yugioh', 'lorcana', 'one_piece'))
  gameId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(10))
  code!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  releaseDate!: Date;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  totalCards!: number;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  logoUrl?: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description?: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  block?: string; // For MTG

  @AllowNull(true)
  @Column(DataType.ENUM('core', 'expansion', 'supplemental', 'promo', 'special'))
  setType?: string;
}