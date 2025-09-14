import { Role } from 'src/modules/security/roles/entities/role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    unique: true,
  })
  name: string; // Unique value, e.g.: "user.create"

  @Column({
    type: 'text',
  })
  description: string; // Readable name for the UI, e.g.: "Create user"

  @Column({
    type: 'boolean',
    default: true,
  })
  status: boolean;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
