import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'event_rsvps' })
export class EventRSVP extends Model {
  @Column(DataType.INTEGER)
  eventId!: number;

  @Column(DataType.INTEGER)
  userId!: number;

  @Column(DataType.ENUM('attending', 'maybe', 'declined'))
  status!: string;
}