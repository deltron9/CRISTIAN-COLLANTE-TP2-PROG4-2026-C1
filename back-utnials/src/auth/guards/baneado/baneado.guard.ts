import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from '../../../usuarios/entities/usuario.entity';
@Injectable()
export class BaneadoGuard implements CanActivate {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const usuarioLogeado = request.user;
    
    if (!usuarioLogeado) {
      throw new UnauthorizedException('No se encontró un usuario autenticado en la petición');
    }

    const usuarioDb = await this.usuarioModel.findById(usuarioLogeado.id || usuarioLogeado._id);

    if (!usuarioDb) {
      throw new UnauthorizedException('El usuario ya no existe en el sistema');
    }

    if (usuarioDb.activo === false) {
      throw new ForbiddenException('Cuenta desactivada por un administrador');
    }

    return true;
  }
}