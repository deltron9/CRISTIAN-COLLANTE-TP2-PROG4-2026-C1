import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

export type ComentarioDocument = mongoose.HydratedDocument<Comentario>;

@Schema({ collection: 'comentarios_utnials', timestamps: true })
export class Comentario {
    @Prop({ required: true, maxlength: 500 })
    texto!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true })
    autor!: Usuario;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion', required: true })
    publicacion!: mongoose.Types.ObjectId;

    @Prop({ type: Boolean, default: false })
    modificado!: boolean;

    @Prop({ type: String, default: 'activo' })
    estado!: string;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);