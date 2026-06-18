import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = (request as any).user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (user.perfil !== 'admin') {
      throw new ForbiddenException('DENEGADO: Tenes que ser administrador');
    }

    return true;
  }
}