import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'offers' })
export class Offer extends Model {
  @Column(DataType.INTEGER)
  listingId!: number;

  @Column(DataType.INTEGER)
  buyerId!: number;

  @Column(DataType.DECIMAL)
  amount?: number;

  @Column(DataType.TEXT)
  message?: string;

  @Column(DataType.ENUM('pending', 'accepted', 'declined', 'countered'))
  status!: string;
}