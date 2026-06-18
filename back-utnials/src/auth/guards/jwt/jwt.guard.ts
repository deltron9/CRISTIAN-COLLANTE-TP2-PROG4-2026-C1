import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtGuard implements CanActivate {

  constructor(private readonly auth: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();    
    const token = request.cookies?.['autorizacion'];

    if (!token) {
      throw new UnauthorizedException('No se adquirio la cookie de sesion');
    }

    try {
      const payload = this.auth.verificarToken(token);

      (request as any).user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Sesión desconocida o expirada');
    }
  }
}