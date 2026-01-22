import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'reviews' })
export class Review extends Model {
  @Column(DataType.INTEGER)
  reviewerId!: number;

  @Column(DataType.INTEGER)
  revieweeId!: number;

  @Column(DataType.INTEGER)
  transactionId!: number;

  @Column(DataType.INTEGER)
  rating!: number;

  @Column(DataType.TEXT)
  comment?: string;
}