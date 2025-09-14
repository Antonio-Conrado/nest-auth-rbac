import { User } from '../entities/user.entity';

export class UserListItemDto {
  id: number;
  fullName: string;
  email: string;
  telephone: string;
  profilePhotoUrl: string | null;
  status: boolean;
  roleName: string;

  constructor(user: User) {
    this.id = user.id;
    this.fullName = user.fullName; // getter
    this.email = user.email;
    this.telephone = user.telephone || '';
    this.profilePhotoUrl = user.profilePhotoUrl;
    this.status = user.status;
    this.roleName = user.role.name;
  }
}
