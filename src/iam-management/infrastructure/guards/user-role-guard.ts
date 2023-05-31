import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { Account } from 'src/iam-management/domain/entities/account.entity';
import { META_ROLES } from 'src/iam-management/application/decorators/role-protected.decorator';
import { User } from 'src/iam-management/domain/entities/user.entity';

export interface userFullInfo {
  account: Account;
  user: User;
}

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const { account } = req.user as userFullInfo;

    if (!account) throw new BadRequestException('User not found');

    for (const role of account.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${account.username} need a valid role: [${validRoles}]`,
    );
  }
}
