import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from 'src/iam-management/domain/interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { Account } from '../../domain/entities/account.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { id } = payload;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.account', 'account')
      .where('user.id = :id', { id: id })
      .getOne();

    if (!user) throw new UnauthorizedException('Token not valid');
    /*if (!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin');*/
    return user;
  }
}
