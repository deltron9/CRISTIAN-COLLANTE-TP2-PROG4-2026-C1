import { IsDateString, IsString, MinLength, Matches, IsEmail, IsOptional, IsIn } from 'class-validator';

const MENSAJE_LENGHT_MINIMO = 'La contraseña debe tener un minimo de 8 caracteres.';
const MENSAJE_PASS_COMPATIBLE = 'La contraseña debe contener al menos una mayuscula y un numero, soquete.';
const PASS_REGEX = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(8, { message: MENSAJE_LENGHT_MINIMO })
  @Matches(PASS_REGEX, { message: MENSAJE_PASS_COMPATIBLE })
  password: string;

  @IsDateString()
  fechaNacimiento: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin'], {
    message: 'El perfil debe ser "user" o "admin"',
  })
  perfil?: string;

  @IsOptional()
  activo?: boolean;
}