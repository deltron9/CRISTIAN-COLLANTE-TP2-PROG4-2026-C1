import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comentario, ComentarioDocument } from './entities/comentario.entity';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { PublicacionesService } from 'src/publicaciones/publicaciones.service';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name) private comentarioModel: Model<ComentarioDocument>,
    private readonly publicacionesService: PublicacionesService
  ) {}

  async crear(createDto: CreateComentarioDto, autorId: string, publicacionId: string): Promise<Comentario> {
    const nuevoComentario = new this.comentarioModel({
      texto: createDto.texto,
      autor: autorId as any,
      publicacion: publicacionId as any,
      estado: 'activo',
      modificado: false,
    });

    const comentarioGuardado = await nuevoComentario.save();
    await this.publicacionesService.agregarComentario(publicacionId, comentarioGuardado._id.toString());

    const comentarioPopulado = await this.comentarioModel.findById(comentarioGuardado._id).populate('autor', 'username nombre apellido imagen').exec();

    if (!comentarioPopulado) {
      throw new NotFoundException('error al intentar comentar');
    }

    return comentarioPopulado;
  }

  async listarPorPublicacion(publicacionId: string,limit: number = 3, offset: number = 0,): Promise<{ comentarios: Comentario[]; total: number }> {
    const queryFiltrada = { publicacion: publicacionId, estado: 'activo'};

    const comentarios = await this.comentarioModel.find(queryFiltrada).sort({createdAt: -1}).skip(offset)
      .limit(limit).populate('autor', 'username nombre apellido imagen').exec();

    const total = await this.comentarioModel.countDocuments(queryFiltrada).exec();

    return { comentarios, total };
  }

  async findOne(id: string): Promise<Comentario> {
    const comentario = await this.comentarioModel.findById(id).populate('autor', 'username nombre apellido imagen').exec();

    if (!comentario || (comentario as any).estado === 'eliminado') {
      throw new NotFoundException('Comentario no encontrado o eliminado');
    }
    return comentario;
  }

  async actualizar(id: string, updateDto: UpdateComentarioDto, userId: string): Promise<Comentario> {
    const comentario = await this.comentarioModel.findById(id).exec();

    if (!comentario || (comentario as any).estado === 'eliminado') {
      throw new NotFoundException('Comentario no encontrado');
    }

    if (comentario.autor.toString() !== userId) {
      throw new ForbiddenException('No tenes permiso para modificar este comentario');
    }

    comentario.texto = updateDto.texto;
    comentario.modificado = true;

    const comentarioActualizado = await comentario.save();

    const comentarioPopulado = await this.comentarioModel.findById(comentarioActualizado._id).populate('autor', 'username nombre apellido imagen').exec();

    if (!comentarioPopulado) {
      throw new NotFoundException('Error al actualizar el comentario');
    }

    return comentarioPopulado;
  }

  async eliminar(id: string, userId: string, userRole: string): Promise<void> {
    const comentario = await this.comentarioModel.findById(id).exec();

    if (!comentario || (comentario as any).estado === 'eliminado') {
      throw new NotFoundException('Comentario no encontrado');
    }

    const esAutor = comentario.autor.toString() === userId;
    const esAdmin = userRole === 'admin';

    if (!esAutor && !esAdmin) {
      throw new ForbiddenException('No tnes permiso para eliminar este comentario');
    }

    (comentario as any).estado = 'eliminado';
    await comentario.save();

    await this.publicacionesService.eliminarComentario(comentario.publicacionId.toString(), id);
  }

  async contarPorPublicacion(publicacionId: string): Promise<number> {
    return this.comentarioModel.countDocuments({ publicacion: publicacionId, estado: 'activo' }).exec();
  }

  async obtenerTodos(): Promise<Comentario[]> {
    return this.comentarioModel.find({ estado: 'activo' }).populate('autor', 'username nombre apellido imagen')
      .populate('publicacion', '_id titulo').sort({createdAt: -1}).exec();
  }
}