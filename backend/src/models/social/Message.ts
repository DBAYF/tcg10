import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'messages' })
export class Message extends Model {
  @Column(DataType.INTEGER)
  senderId!: number;

  @Column(DataType.INTEGER)
  recipientId!: number;

  @Column(DataType.TEXT)
  content!: string;

  @Column(DataType.JSON)
  images?: string[];

  @Column(DataType.INTEGER)
  relatedListingId?: number;

  @Column(DataType.BOOLEAN)
  isRead!: boolean;
}