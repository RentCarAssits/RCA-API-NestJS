import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RoleProtected } from './role-protected.decorator';
import { ValidRoles } from 'src/iam-management/domain/interfaces/valid-roles';
import { UserRoleGuard } from 'src/iam-management/infrastructure/guards/user-role-guard';



export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
