import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Help  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  video_url: string;
}