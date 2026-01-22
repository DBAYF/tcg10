import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'conversations' })
export class Conversation extends Model {
  @Column(DataType.JSON)
  participants!: number[];

  @Column(DataType.INTEGER)
  unreadCount!: number;
}