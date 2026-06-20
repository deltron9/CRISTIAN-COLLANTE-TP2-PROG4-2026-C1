import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateComentarioDto {
    @IsString()
    @MinLength(1, { message: 'El comentario no puede estar vacío' })
    @MaxLength(500, { message: 'El comentario no puede exceder los 500 caracteres' })
    texto!: string;
}