
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {

  constructor(@InjectModel(Usuario.name) private UsuarioModel: Model<Usuario>){}

    async create(createUsuarioDto: CreateUsuarioDto, imagenUrl: string = '', esHasheado: boolean = false): Promise<HydratedDocument<Usuario>> {
    
    let passwordHasheado = createUsuarioDto.password;
    
    const emailRegistrado = await this.UsuarioModel.findOne({ email: createUsuarioDto.email });
    if (emailRegistrado) {
      throw new ConflictException('El email ya está registrado');
    }

    const usernameRegistrado = await this.UsuarioModel.findOne({ username: createUsuarioDto.username });
    if (usernameRegistrado) {
      throw new ConflictException('El username ya está ocupado');
    }

    if (!esHasheado) {
      passwordHasheado = await bcrypt.hash(createUsuarioDto.password, 10);
    }

    const nuevoUsuario = new this.UsuarioModel({
      nombre: createUsuarioDto.nombre,
      apellido: createUsuarioDto.apellido,
      email: createUsuarioDto.email,
      username: createUsuarioDto.username,
      password: passwordHasheado,
      fechaNacimiento: createUsuarioDto.fechaNacimiento,
      descripcion: createUsuarioDto.descripcion || '',
      imagen: imagenUrl,
      perfil: createUsuarioDto.perfil || 'user',
      activo: createUsuarioDto.activo !== undefined ? createUsuarioDto.activo : true
    });

    return await nuevoUsuario.save();
  }

  async findByEmailOrUsername(identifier: string): Promise<Usuario | null> {
    return this.UsuarioModel.findOne({ $or: [{ email: identifier }, { username: identifier }],}).select('+password').exec();
  }

  async findAll(): Promise<Usuario[]> {
    return this.UsuarioModel.find().exec();
  }

  async findOne(id: string): Promise<Usuario | null> {
    return this.UsuarioModel.findById(id).exec();
  }

  async habilitar(id: string) {
    await this.UsuarioModel.findByIdAndUpdate(id, { activo: true }).exec();
    return { message: 'usuario dado de alta' };
  }

  async deshabilitar(id: string) {
    await this.UsuarioModel.findByIdAndUpdate(id, { activo: false }).exec();
    return { message: 'Usuario dado de baja' };
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return this.UsuarioModel.findByIdAndUpdate(id, updateUsuarioDto, { new: true }).exec();
  }
}
