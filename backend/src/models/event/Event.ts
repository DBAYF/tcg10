import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'events' })
export class Event extends Model {
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.ENUM('pokemon', 'mtg', 'yugioh', 'lorcana', 'one_piece'))
  gameId!: string;

  @Column(DataType.ENUM('tournament', 'meetup', 'draft', 'sealed', 'casual'))
  eventType!: string;

  @Column(DataType.ENUM('community', 'official'))
  source!: string;

  @Column(DataType.DATE)
  startDate!: Date;

  @Column(DataType.DATE)
  endDate!: Date;

  @Column(DataType.JSON)
  location!: object;

  @Column(DataType.INTEGER)
  maxAttendees?: number;

  @Column(DataType.INTEGER)
  currentAttendees!: number;

  @Column(DataType.DECIMAL)
  entryFee?: number;

  @Column(DataType.INTEGER)
  organizerId!: number;

  @Column(DataType.STRING)
  coverImageUrl?: string;
}