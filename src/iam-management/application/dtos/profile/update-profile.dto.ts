import { IsBoolean, IsOptional, IsString } from 'class-validator';


export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  dni: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
