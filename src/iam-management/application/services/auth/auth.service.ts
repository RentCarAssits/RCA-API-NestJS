import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../../dtos/user/login.dto';
import { JwtPayload } from 'src/iam-management/domain/interfaces/jwt-payload.interface';
import { User } from '../../../domain/entities/user.entity';
import { CreateUserDto } from '../../dtos/user/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { profile, password, userName, roles, email } = createUserDto;

      //  console.log(profile);
      const passwordBcrypt = bcrypt.hashSync(password, 10);
      const accountName = `account_${Math.random().toString(36).substring(7)}`;

      const auxUser = {
        profile: profile,
        email,
        userName,
        roles,
        account: { name: accountName },
        password: passwordBcrypt,
      };

      const existUserByEmail = await this.userRepository.findOne({
        where: { email: email },
      });
      const existUserByUserName = await this.userRepository.findOne({
        where: { userName: userName },
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
      delete user.password;
      delete user.profile;
      delete user.account;

      console.log(user);
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginDto: LoginDto) {
    const { email, userName, password } = loginDto;
    let user: { password: string; id: number; userName: string; email: string };
    email
      ? (user = await this.userRepository.findOne({
          where: { email },
          select: {
            email: true,
            password: true,
            roles: true,
            id: true,
            userName: true,
          },
        }))
      : (user = await this.userRepository.findOne({
          where: { userName },
          select: {
            password: true,
            userName: true,
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

  async checkAuthStatus(user) {
    const { id, userName, email } = user;
    return {
      id,
      userName,
      email,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.response.statusCode === 400)
      throw new BadRequestException(`${error.response.message}`);
    console.log(error.response.message);
    throw new InternalServerErrorException(
      `${error.response.message}` || 'check logs',
    );
  }
}
