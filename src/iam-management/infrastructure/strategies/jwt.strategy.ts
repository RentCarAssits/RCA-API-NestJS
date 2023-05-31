import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Account } from 'src/iam-management/domain/entities/account.entity';
import { User } from 'src/iam-management/domain/entities/user.entity';
import { JwtPayload } from 'src/iam-management/domain/interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';

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

    const account = await this.accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.user', 'user')
      .where('account.id = :id', { id })
      .getOne();

    const { user } = account;

    const userFullInfo = {
      user: user?? '',
      account: {
        id: account.id,
        username: account.username,
        email: account.email,
        roles: account.roles,
      },
    };

    if (!account) throw new UnauthorizedException('Token not valid');

    /* if ( !user.isActive ) 
            throw new UnauthorizedException('User is inactive, talk with an admin');*/
    return userFullInfo;
  }
}
