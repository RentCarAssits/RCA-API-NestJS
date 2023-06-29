import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/iam-management/application/decorators/auth.decorator';
import { GetUser } from 'src/iam-management/application/decorators/get-user.decorator';
import { RoleProtected } from 'src/iam-management/application/decorators/role-protected.decorator';
import { CreateUserDto } from 'src/iam-management/application/dtos/user/create-user.dto';
import { LoginDto } from 'src/iam-management/application/dtos/user/login.dto';
import { AuthService } from 'src/iam-management/application/services/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from 'src/iam-management/domain/interfaces/valid-roles';
import { UserRoleGuard } from 'src/iam-management/infrastructure/guards/user-role-guard';
import { User } from '../../domain/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() LoginAccountDto: LoginDto) {
    return this.authService.login(LoginAccountDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(@Req() request: Express.Request, @GetUser() user: User) {
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
    };
  }

  // @SetMetadata('roles', ['admin','super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.owner)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
