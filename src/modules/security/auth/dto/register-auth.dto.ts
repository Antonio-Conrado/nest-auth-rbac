import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class RegisterAuthDto extends OmitType(CreateUserDto, ['roleId']) {}
