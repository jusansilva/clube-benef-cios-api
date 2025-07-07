import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn, // <-- adicione isto
} from 'typeorm';
import { Sale } from './sale.entity';

@Entity('client')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ nullable: false })
  password: string;

  @Column({ length: 255, unique: true, nullable: false })
  email: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Sale, (sale) => sale.client)
  sales: Sale[];
}
