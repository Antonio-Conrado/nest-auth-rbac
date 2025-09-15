export interface IPermission {
  id: number;
  name: string;
  description: string;
  status: boolean;
}

export interface IRole {
  id: number;
  name: string;
  status: boolean;
  permissions: IPermission[];
}
export interface IRoleSeed {
  name: string;
  status: boolean;
  permissions: IPermission[];
}

export interface IUserSecurity {
  id: number;
  confirmationToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  rememberToken: string | null;
  rememberTokenExpires: Date | null;
  refreshToken: string | null;
  refreshTokenExpires: string | null;
}

export interface IUser {
  id: number;
  name: string;
  surname: string;
  nameComplete: string;
  email: string;
  password: string;
  telephone: string | null;
  profilePhotoUrl: string | null;
  isAccountConfirmed: boolean;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  roleId: number;
  role: IRole;
  security: IUserSecurity;
}
