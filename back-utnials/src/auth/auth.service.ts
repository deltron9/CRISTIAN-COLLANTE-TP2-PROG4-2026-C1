import { UsuariosService } from './../usuarios/usuarios.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';


@Injectable()
export class AuthService {

  constructor(private readonly usuariosService: UsuariosService) {}

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: string, email: string, username: string): string {
    const payload = { id: userId, email, username, exp: Date.now() + 60 * 15 };
    const clave_secreta = process.env.JWT_SECRET!;
    
    return jwt.sign(payload, clave_secreta, {algorithm: 'HS256', audience: 'registro'});
  }

  async registro(usuarioDto: CreateUsuarioDto, imagenUrl: string) {
    try {

      const usuarioCreado = await this.usuariosService.create(usuarioDto, imagenUrl);

      const token = this.generateToken(
        usuarioCreado._id.toString(),
        usuarioCreado.email,
        usuarioCreado.username
      );

      return { token, usuario: usuarioCreado };

    } catch (error) {
      if (error.status === 409) {
        throw error;
      }
      throw new UnauthorizedException('No se pudo completar el registro');
    }
  }
}
