import { Type } from 'class-transformer';
import { CreateAccountDto } from './create-account.dto';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { AccountDto } from './account.dto';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  address: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  dni: string;


  @IsNotEmpty()
  account: AccountDto;
}
