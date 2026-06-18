import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateComentarioDto {
    @IsString()
    @IsNotEmpty({ message: 'El texto del comentario no puede estar vacío' })
    @MinLength(1, { message: 'El comentario debe tener al menos 1 carácter' })
    @MaxLength(150, { message: 'El comentario no puede superar los 150 caracteres' })
    texto: string;
    @IsString()
    @IsNotEmpty()
    publicacionId: string;
}