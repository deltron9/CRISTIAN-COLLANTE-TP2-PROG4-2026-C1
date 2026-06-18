import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePublicacioneDto {
    @IsString()
    @IsNotEmpty({ message: 'no puede estar vacio' })
    titulo: string;

    @IsString()
    @IsNotEmpty({ message: 'no puede estar vacio tampoco chabon' })
    descripcion: string;

    @IsString()
    @IsOptional()
    imagenUrl?: string;
}
