import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'comments' })
export class Comment extends Model {
  @Column(DataType.INTEGER)
  postId!: number;

  @Column(DataType.INTEGER)
  authorId!: number;

  @Column(DataType.TEXT)
  content!: string;

  @Column(DataType.INTEGER)
  parentCommentId?: number;

  @Column(DataType.INTEGER)
  likes!: number;
}