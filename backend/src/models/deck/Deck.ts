import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'decks' })
export class Deck extends Model {
  @Column(DataType.INTEGER)
  userId!: number;

  @Column(DataType.ENUM('pokemon', 'mtg', 'yugioh', 'lorcana', 'one_piece'))
  gameId!: string;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column(DataType.STRING)
  format!: string;

  @Column(DataType.BOOLEAN)
  isPublic!: boolean;

  @Column(DataType.STRING)
  coverImageUrl?: string;

  @Column(DataType.JSON)
  tags!: string[];
}