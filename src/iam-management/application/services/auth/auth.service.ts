import { CreateUserDto } from '../../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { Account } from 'src/iam-management/domain/entities/account.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAccountDto } from '../../dtos/login-account.dto';
import { JwtPayload } from 'src/iam-management/domain/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { account, fullName, address, email, phone, dni } = createUserDto;
      const { username, password } = account;
      const roles = ['renter'];
      const passwordBcrypt = bcrypt.hashSync(password, 10);
      const auxUser = {
        fullName,
        address,
        email,
        phone,
        dni,
        account: { roles, email, username, password: passwordBcrypt },
      };

      const existUserByEmail = await this.userRepository.findOne({
        where: { email: email },
      });
      const existUserByUserName = await this.accountRepository.findOne({
        where: { username: username },
      });

      if (existUserByEmail) {
        throw new BadRequestException(
          'There is already a user with that email and username',
        );
      }

      if (existUserByUserName) {
        throw new BadRequestException(
          'There is already a user with that username',
        );
      }
      const user = this.userRepository.create(auxUser);
      await this.userRepository.save(user);
      delete account.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginDto: LoginAccountDto) {
    const { email, username, password } = loginDto;
    let user = {
      id: 0,
      username: email,
      email: email,
      password: password,
    };
    email
      ? (user = await this.accountRepository.findOne({
          where: { email },
          select: {
            email: true,
            password: true,
            roles: true,
            id: true,
            username: true,
          },
        }))
      : (user = await this.accountRepository.findOne({
          where: { username },
          select: {
            password: true,
            username: true,
            roles: true,
            id: true,
            email: true,
          },
        }));

    if (!user) throw new UnauthorizedException('invalid username or email');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('invalid Password');
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: Account) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error.response.message);
    throw new InternalServerErrorException(
      `${error.response.message}` || 'check logs',
    );
  }
}
