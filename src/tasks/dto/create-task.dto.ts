import { IsNotEmpty, IsOptional, IsString, IsMongoId } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsMongoId()
  assignedTo: string;
}
