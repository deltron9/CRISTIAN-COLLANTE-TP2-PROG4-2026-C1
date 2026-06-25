import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicacion, PublicacionDocument } from './entities/publicacione.entity';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';

@Injectable()
export class PublicacionesService {
  constructor(@InjectModel(Publicacion.name) private publicacionModel: Model<PublicacionDocument>) {}

  async create(createDto: CreatePublicacioneDto, autorId: string, imagenUrl: string) {
    const nuevaPublicacion = new this.publicacionModel({
      ...createDto,
      autor: autorId,
      imagenUrl: imagenUrl,
      likes: [],
      likesCantidad: 0,
      activo: true
    });

    const publicacionGuardada = await nuevaPublicacion.save();

    await publicacionGuardada.populate('autor');

    return publicacionGuardada;
  }

  async findAll(limit: number, offset: number, sortBy: string, userId?: string) {
    const query: any = { activo: { $not: { $eq: false } } }; 

    if (userId) {
      query.autor = userId;
    }

    return await this.publicacionModel.find(query).sort({[sortBy]: -1}).skip(offset).limit(limit).populate('autor').exec();
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
    const publicacionModificada = await this.publicacionModel.findByIdAndUpdate(id,{ activo: false },
    { returnDocument:'after'}).exec();

    return publicacionModificada;
  }

  async darLike(publicacionId: string, usuarioId: string) {
    const publicacionActualizada = await this.publicacionModel.findByIdAndUpdate(publicacionId, {$addToSet: {likes: usuarioId},
        $inc: { likesCantidad: 1 }}, {returnDocument: 'after'}).populate('autor').exec();

    return publicacionActualizada;
  }

  async sacarLike(publicacionId: string, usuarioId: string) {
    const publicacionActualizada = await this.publicacionModel.findByIdAndUpdate(publicacionId, {$pull: {likes: usuarioId},
      $inc: {likesCantidad: -1}},
      { returnDocument: 'after' }).populate('autor').exec();

    return publicacionActualizada;
  }

  async eliminarComentario(idPublicacion: string, idComentario: string) {
    return this.publicacionModel.findByIdAndUpdate(idPublicacion, {$pull: { comentarios: idComentario },
    $inc:{comentariosCount:-1}});
  }

  async agregarComentario(idPublicacion: string, idComentario: string) {
    return this.publicacionModel.findByIdAndUpdate( idPublicacion, {$push: { comentarios: idComentario }, $inc:{ comentariosCount: 1 }});
  }

  async obtenerEstadisticasUsuarios(dias?: number) {
    const filter: any = {};

    if (dias) {
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - dias);
      filter.createdAt = { $gte: fechaInicio };
    }

    const publicaciones = await this.publicacionModel.find(filter).select('createdAt autor').populate('autor', 'username').lean().exec();

    const conteoUsuarios: { [username: string]: number } = {};
    publicaciones.forEach((p: any) => {
      if (p.autor && p.autor.username) {
        const username = p.autor.username;
        conteoUsuarios[username] = (conteoUsuarios[username] || 0) + 1;
      }
    });

    return Object.entries(conteoUsuarios)
      .map(([username, total]) => ({label: `@${username}`, data: total})).sort((a, b) => b.data - a.data).slice(0, 10);
  }
}