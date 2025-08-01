import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserSecurity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.security)
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 100, nullable: true })
  confirmationToken: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  rememberToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  rememberTokenExpires: Date | null;
}
