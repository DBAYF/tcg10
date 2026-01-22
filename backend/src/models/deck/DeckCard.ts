import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'deck_cards' })
export class DeckCard extends Model {
  @Column(DataType.INTEGER)
  deckId!: number;

  @Column(DataType.INTEGER)
  cardId!: number;

  @Column(DataType.INTEGER)
  quantity!: number;

  @Column(DataType.TEXT)
  notes?: string;
}