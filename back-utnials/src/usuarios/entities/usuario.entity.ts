import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema({ collection: 'usuarios_utnials', timestamps: true })
export class Usuario {
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

    @Prop({ required: true })
    descripcion: string;

    @Prop({ default: ''})
    imagen: string;

    @Prop({ default: 'user' })
    perfil: string;

    @Prop({ default: true })
    activo: boolean;
}
export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
