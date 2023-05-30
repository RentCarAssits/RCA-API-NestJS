import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { Auth } from 'src/iam-management/application/decorators/auth.decorator';
import { GetUser } from 'src/iam-management/application/decorators/get-user.decorator';
import { RoleProtected } from 'src/iam-management/application/decorators/role-protected.decorator';
import { CreateUserDto } from 'src/iam-management/application/dtos/create-user.dto';
import { LoginAccountDto } from 'src/iam-management/application/dtos/login-account.dto';
import { AuthService } from 'src/iam-management/application/services/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/iam-management/domain/entities/account.entity';
import { RawHeaders } from 'src/iam-management/application/decorators/raw-headers.decorator';
import { IncomingHttpHeaders } from 'http';
import { ValidRoles } from 'src/iam-management/domain/interfaces/valid-roles';
import { UserRoleGuard } from 'src/iam-management/infrastructure/strategies/guards/user-role-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() LoginAccountDto: LoginAccountDto) {
    return this.authService.login(LoginAccountDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() account: Account) {
    return this.authService.checkAuthStatus(account);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: Account,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  // @SetMetadata('roles', ['admin','super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.owner)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: Account) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(@GetUser() user: Account) {
    return {
      ok: true,
      user,
    };
  }
}
