import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateComentarioDto {
    @IsString()
    @MinLength(1, { message: 'El comentario no puede estar vacío' })
    @MaxLength(300, { message: 'El comentario no puede exceder los 300 caracteres' })
    texto: string;
}