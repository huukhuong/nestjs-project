import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('noAuth', true);
export const Permissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
