
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
    });

    return await nuevoUsuario.save();
  }

  async findByEmailOrUsername(identifier: string): Promise<Usuario | null> {
    return this.UsuarioModel.findOne({ $or: [{ email: identifier }, { username: identifier }],}).select('+password').exec();
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
