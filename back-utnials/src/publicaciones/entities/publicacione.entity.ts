import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Comentario } from 'src/comentarios/entities/comentario.entity';

export type PublicacionDocument = mongoose.HydratedDocument<Publicacion>;

@Schema({ collection: 'publicaciones_utnials', timestamps: true })
export class Publicacion {
    @Prop({ required: true })
    titulo: string;

    @Prop({ required: true })
    descripcion: string;

    @Prop()
    imagenUrl?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Usuario.name, required: true })
    autor: Usuario;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Usuario.name }])
    meGusta: Usuario[];

    @Prop({ default: 0 })
    meGustaCount: number;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Comentario.name }])
    comentarios: Comentario[];

    @Prop({ default: 0 })
    comentariosCount: number;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
