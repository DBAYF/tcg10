import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'notifications' })
export class Notification extends Model {
  @Column(DataType.INTEGER)
  userId!: number;

  @Column(DataType.ENUM(
    'new_offer',
    'offer_response',
    'new_message',
    'new_follower',
    'deck_engagement',
    'price_drop',
    'event_reminder',
    'order_update'
  ))
  type!: string;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  message!: string;

  @Column(DataType.JSON)
  data?: object;

  @Column(DataType.BOOLEAN)
  isRead!: boolean;
}