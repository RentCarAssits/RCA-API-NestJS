import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';



export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  dni: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
