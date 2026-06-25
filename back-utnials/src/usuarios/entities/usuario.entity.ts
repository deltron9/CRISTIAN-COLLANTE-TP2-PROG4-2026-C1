import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema({ collection: 'usuarios_utnials', timestamps: true })
export class Usuario {

    _id: Types.ObjectId;

    @Prop({ required: true, trim: true, lowercase: true })
    nombre: string;

    @Prop({ required: true, trim: true, lowercase: true })
    apellido: string;

    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    email: string;

    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    username: string;

    @Prop({ required: true, select: false, trim: true })
    password: string;

    @Prop({ required: true })
    fechaNacimiento: Date;

    @Prop({ required: false })
    descripcion: string;

    @Prop({ default: ''})
    imagen: string;

    @Prop({ default: 'user' })
    perfil: string;

    @Prop({ default: true })
    activo: boolean;
}
export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
