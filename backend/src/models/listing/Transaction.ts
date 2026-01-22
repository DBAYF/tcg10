import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'transactions' })
export class Transaction extends Model {
  @Column(DataType.INTEGER)
  listingId!: number;

  @Column(DataType.INTEGER)
  buyerId!: number;

  @Column(DataType.INTEGER)
  sellerId!: number;

  @Column(DataType.DECIMAL)
  amount!: number;

  @Column(DataType.ENUM('pending_payment', 'paid', 'shipped', 'delivered', 'completed', 'cancelled'))
  status!: string;
}