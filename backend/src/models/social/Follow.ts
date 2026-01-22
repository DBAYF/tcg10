import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'follows' })
export class Follow extends Model {
  @Column(DataType.INTEGER)
  followerId!: number;

  @Column(DataType.INTEGER)
  followingId!: number;

  @Column(DataType.ENUM('active', 'blocked'))
  status!: string;
}