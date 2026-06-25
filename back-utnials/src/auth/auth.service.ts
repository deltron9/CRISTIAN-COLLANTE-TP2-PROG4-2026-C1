import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { Usuario, UsuarioDocument } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>
  ) {}

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: string, email: string, username: string, perfil: string): string {
    const payload = { id: userId, email, username, perfil };
    const clave_secreta = process.env.JWT_SECRET!;
    const tiempo_exp_token = process.env.JWT_VENC_TOKEN!;
    
    return jwt.sign(payload, clave_secreta, { algorithm: 'HS256', audience: 'utnials', expiresIn: tiempo_exp_token as any });
  }

  async registro(usuarioDto: CreateUsuarioDto, imagenUrl: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHasheada = await bcrypt.hash(usuarioDto.password, salt);
      
      const usuarioCreado = await this.usuarioModel.create({
        ...usuarioDto,
        password: passwordHasheada,
        imagen: imagenUrl,
        perfil: usuarioDto.perfil || 'user'
      });

      const token = this.generateToken(
        usuarioCreado._id.toString(),
        usuarioCreado.email,
        usuarioCreado.username,
        usuarioCreado.perfil
      );

      return { token, usuario: usuarioCreado };

    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('El usuario o email ya existe'); 
      }
      
      if (error.status === 400) {
        throw error;
      }
      
      throw new InternalServerErrorException('No se pudo completar el registro debido a un error interno'); // Devuelve 500
    }
  }

  async login(identificador: string, passwordIngresada: string) {
    const usuario = await this.usuarioModel.findOne({
      $or: [{ email: identificador }, { username: identificador }]
    }).select('+password'); 

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!passwordIngresada) {
      throw new UnauthorizedException('La contraseña es requerida');
    }

    if (!usuario.password) {
      throw new UnauthorizedException('El usuario no posee una credencial de acceso válida');
    }

    if (usuario.activo === false) {
      throw new UnauthorizedException('Cuenta desactivada por un admin');
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
      usuarioSinPassword.perfil
    );

    return { token, usuario: usuarioSinPassword };
  }

  verificarToken(token: string): any {
    try {
      const clave_secretita = process.env.JWT_SECRET!;
      return jwt.verify(token, clave_secretita) as any;
    } catch (error) {
      throw new UnauthorizedException('Token invalido o expirado');
    }
  }

  async refrescar(tokenViejo: string): Promise<string> {
    try {
      const payload = this.verificarToken(tokenViejo);
      const usuario = await this.usuarioModel.findById(payload.id);

      if (!usuario) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const nuevoToken = this.generateToken(
        payload.id,
        payload.email,
        payload.username,
        payload.perfil
      );
      return nuevoToken;

    } catch (error) {
      throw new UnauthorizedException('sesion desconocida o expirada');
    }
  }

  async buscarPorId(id: string) {
    const usuario = await this.usuarioModel.findById(id);
    if (!usuario) {
      throw new UnauthorizedException('usuario no encontrado');
    }
    const { password, ...usuarioSinPassword } = usuario.toObject();
    return usuarioSinPassword;
  }
}