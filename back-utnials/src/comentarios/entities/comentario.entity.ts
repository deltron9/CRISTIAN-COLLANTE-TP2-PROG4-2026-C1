import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

export type ComentarioDocument = mongoose.HydratedDocument<Comentario>;

@Schema({ timestamps: true })
export class Comentario {
    @Prop({ required: true })
    texto: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Usuario.name, required: true })
    autor: Usuario;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion', required: true })
    publicacion: string;

    @Prop({ default: false })
    modificado: boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);