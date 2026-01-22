import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'listings' })
export class Listing extends Model {
  @Column(DataType.INTEGER)
  sellerId!: number;

  @Column(DataType.INTEGER)
  cardId!: number;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column(DataType.DECIMAL)
  price!: number;

  @Column(DataType.STRING)
  condition!: string;

  @Column(DataType.BOOLEAN)
  isFoil!: boolean;

  @Column(DataType.INTEGER)
  quantity!: number;

  @Column(DataType.ENUM('sale', 'trade', 'sale_or_trade'))
  listingType!: string;

  @Column(DataType.ENUM('active', 'sold', 'inactive'))
  status!: string;
}