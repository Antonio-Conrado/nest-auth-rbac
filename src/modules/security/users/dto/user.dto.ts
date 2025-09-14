import { User } from '../entities/user.entity';

export class UserDto {
  id: number;
  fullName: string;
  email: string;
  telephone: string;
  profilePhotoUrl: string | null;
  isAccountConfirmed: boolean;
  status: boolean;
  createdAt: Date;
  role: {
    id: number;
    name: string;
    status: boolean;
    permissions: { id: number; name: string; status: boolean }[];
  };

  constructor(user: User) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.telephone = user.telephone || '';
    this.profilePhotoUrl = user.profilePhotoUrl;
    this.isAccountConfirmed = user.isAccountConfirmed;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.role = {
      id: user.role.id,
      name: user.role.name,
      status: user.role.status,
      permissions: user.role.permissions.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
      })),
    };
  }
}
