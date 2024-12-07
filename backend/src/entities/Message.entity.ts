import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true, length: 36 })
  chatId: string;

  @Column({ length: 255 })
  senderEmail: string;

  @Column({ nullable: true, length: 255 })
  recipientEmail: string;

  @Column()
  type: string;

  @Column({ nullable: true, type: 'text' })
  message: string;

  @Column({ type: 'datetime', nullable: true })
  timestamp: Date;

  @Column({ nullable: true, length: 20 })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
