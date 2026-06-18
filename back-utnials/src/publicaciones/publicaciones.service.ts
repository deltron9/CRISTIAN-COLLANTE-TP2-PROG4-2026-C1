import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion, PublicacionDocument } from './entities/publicacione.entity';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';

@Injectable()
export class PublicacionesService {
  constructor(@InjectModel(Publicacion.name) private publicacionModel: Model<PublicacionDocument>) {}

  async create(createDto: CreatePublicacioneDto, autorId: string, imagenUrl?: string) {
    const nuevaPublicacion = new this.publicacionModel({
      ...createDto,
      autor: autorId,
      imagenUrl: imagenUrl,
      estado: 'activo',
      likes: [],
      cantidadLikes: 0,
      comentarios: [],
      cantidadComentarios: 0,
    });
    return nuevaPublicacion.save();
  }

  async findAll(limit: number, offset: number, sortBy: string, userId?: string) {
    const filter: any = { estado: 'activo' };
    if (userId) {
      filter.autor = userId;
    }

    let sortOptions: any;
    if (sortBy === 'likes') {
      sortOptions = { meGustaCount: -1, createdAt: -1 };
    } else {
      sortOptions = { createdAt: -1 };
    }

    return this.publicacionModel.find(filter).sort(sortOptions).skip(offset).limit(limit)
    .populate('autor', 'username imagen nombre apellido').exec();
  }

  async obtenerTodas() {
    return this.publicacionModel.find({ estado: 'activo' }).sort({createdAt: -1 })
    .populate('autor', 'username imagen nombre apellido').exec();
  }

  async findOne(id: string) {
    const publicacion = await this.publicacionModel.findById(id).populate('autor', 'username imagen nombre apellido').exec();
    if (!publicacion) {
      throw new NotFoundException('publicacion desconocida');
    }
    return publicacion;
  }

  async findByUsuario(usuarioId: string, limit: number = 3) {
    return this.publicacionModel.find({autor: usuarioId as any, estado: 'activo' }).sort({createdAt: -1})
      .limit(limit).populate('autor', 'username imagen nombre apellido').exec();
  }

  async bajaLogica(id: string) {
    const publicacion = await this.publicacionModel.findByIdAndUpdate(id, { estado: 'eliminado' }, {new: true});
    if (!publicacion) {
      throw new NotFoundException('publicacion no encontrada');
    }
    return publicacion;
  }

  async darLike(idPublicacion: string, userId: string) {
    const publicacion = await this.publicacionModel.findById(idPublicacion);
    if (!publicacion) {
      throw new NotFoundException('Publicación no encontrada');
    }

    const yaTieneLike = publicacion.meGusta.some((id) => id.toString() === userId.toString());
    if (yaTieneLike) {
      return publicacion;
    }

    return this.publicacionModel.findByIdAndUpdate(idPublicacion, {$addToSet: { meGusta: userId }, 
      $inc: {meGustaCount: 1}}, { new: true }).populate('autor', 'username imagen nombre apellido');
  }

  async sacarLike(idPublicacion: string, userId: string) {
    const publicacion = await this.publicacionModel.findById(idPublicacion);
    if (!publicacion) {
      throw new NotFoundException('publicacion no encontrada');
    }

    const tieneLike = publicacion.meGusta.some((id) => id.toString() === userId.toString());
    if (!tieneLike) {
      return publicacion;
    }

    return this.publicacionModel.findByIdAndUpdate(idPublicacion, {$pull: { meGusta: userId }, 
      $inc: { meGustaCount: -1 }},{ new: true }).populate('autor', 'username imagen nombre apellido');
  }

  async eliminarComentario(idPublicacion: string, idComentario: string) {
    return this.publicacionModel.findByIdAndUpdate(idPublicacion, {$pull: { comentarios: idComentario },
    $inc:{comentariosCount:-1}});
  }
}