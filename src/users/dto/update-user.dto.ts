import { IsEmail, IsOptional, IsIn } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(['admin', 'normal'])
  role?: string;
}
