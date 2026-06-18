import { UsuariosService } from './../usuarios/usuarios.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { UsuarioDocument } from 'src/usuarios/entities/usuario.entity';


@Injectable()
export class AuthService {

  constructor(private readonly usuariosService: UsuariosService) {}

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: string, email: string, username: string): string {
    const payload = { id: userId, email, username};
    const clave_secreta = process.env.JWT_SECRET!;
    const tiempo_exp_token = process.env.JWT_VENC_TOKEN!;
    
    return jwt.sign(payload, clave_secreta, {algorithm: 'HS256', audience: 'utnials', expiresIn: tiempo_exp_token as any});
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

  async login(identificador: string, passwordIngresada: string) {
    const usuario = await this.usuariosService.findByEmailOrUsername(identificador);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordCorrecta = await this.comparePasswords(passwordIngresada, usuario.password);
    if (!passwordCorrecta) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { password, ...usuarioSinPassword } = (usuario as UsuarioDocument).toObject();

    const token = this.generateToken(
      usuarioSinPassword._id.toString(),
      usuarioSinPassword.email,
      usuarioSinPassword.username,
    );

    return { token, usuario: usuarioSinPassword };
  }

  verificarToken(token: string): any {
    try {
      const clave_secretita = process.env.JWT_SECRET!
      return jwt.verify(token, clave_secretita) as any;
    } catch (error) {
      throw new UnauthorizedException('Token invalido o expirado');
    }
  }

  async refrescar(tokenViejo: string): Promise<string> {
    try {
      const payload = this.verificarToken(tokenViejo);
      const usuario = await this.usuariosService.findOne(payload.id);

      if (!usuario) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const nuevoToken = this.generateToken(
        payload.id,
        payload.username,
        payload.perfil,
      );
      return nuevoToken;

    } catch (error) {
      throw new UnauthorizedException('sesion desconocida o expirada');
    }
  }
}
