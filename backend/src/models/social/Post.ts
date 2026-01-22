import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'posts' })
export class Post extends Model {
  @Column(DataType.INTEGER)
  authorId!: number;

  @Column(DataType.TEXT)
  content!: string;

  @Column(DataType.JSON)
  images?: string[];

  @Column(DataType.INTEGER)
  relatedDeckId?: number;

  @Column(DataType.INTEGER)
  relatedListingId?: number;

  @Column(DataType.INTEGER)
  relatedEventId?: number;

  @Column(DataType.INTEGER)
  likes!: number;

  @Column(DataType.INTEGER)
  comments!: number;
}