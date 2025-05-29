import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['Pendiente', 'En proceso', 'Terminada'])
  status?: string;
}
