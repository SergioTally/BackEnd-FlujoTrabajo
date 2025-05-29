import { IsEmail, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsIn(['admin', 'normal'])
  role?: string;
}
