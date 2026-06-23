import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UnauthorizedException, HttpStatus, HttpCode, Res, Req, BadRequestException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly cloudinaryService: CloudinaryService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('profileImg'))
  async registrar(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Res({ passthrough: false}) response: Response
  ) {
    let urlImagen: string;

    if (file) {
      urlImagen = await this.cloudinaryService.subirImagen(file, 'avatars');
    } else {

      const AVATARES_DEFAULT = [
        'https://res.cloudinary.com/dlhhbgj7r/image/upload/v1781149021/484542031_949840150685615_2406191763916346111_n_cldvap.jpg',
        'https://res.cloudinary.com/dlhhbgj7r/image/upload/v1781149020/482052847_949840070685623_4081430447028400932_n_jcualm.jpg',
        'https://res.cloudinary.com/dlhhbgj7r/image/upload/v1781149020/482029900_949840157352281_5030731704116168899_n_jytyak.jpg',
        'https://res.cloudinary.com/dlhhbgj7r/image/upload/v1781149020/484105246_949840100685620_6419628444480545544_n_hztnl8.jpg',
        'https://res.cloudinary.com/dlhhbgj7r/image/upload/v1781149020/482056780_949840174018946_2539982982619622742_n_zinnf2.jpg',
        'https://res.cloudinary.com/dlhhbgj7r/image/upload/v1781149020/484079314_949839960685634_7088690828856529057_n_mlspkt.jpg',
        'https://res.cloudinary.com/dlhhbgj7r/image/upload/v1781149020/482032967_949840107352286_1958018150153196724_n_kgl7qb.jpg'
      ];
      const random = Math.floor(Math.random() * AVATARES_DEFAULT.length);
      urlImagen = AVATARES_DEFAULT[random];
    }

    const {token, usuario} = await this.authService.registro(createUsuarioDto, urlImagen);

    response.cookie('autorizacion', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 15),
    });
    
    response.send({
      statusCode: HttpStatus.CREATED,
      message: 'Usuario registrado con éxito',
      data: usuario
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body('identificador') identificador: string,
    @Body('passwordIngresada') passwordIngresada: string,
    @Res({ passthrough: false}) response: Response
  ) {
    const {token, usuario} = await this.authService.login(identificador, passwordIngresada);
    response.cookie('autorizacion', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 15),
    });

    response.send({
      statusCode: HttpStatus.OK,
      message: 'Login exitoso',
      data: usuario
    });
  }

  @Post('refrescar')
  @HttpCode(HttpStatus.OK)
  async refrescar(@Req() request: Request, @Res({passthrough: true}) response: Response) {
    const tokenViejo = request.cookies['autorizacion'];
    if (!tokenViejo){ 
      throw new BadRequestException('Token no proporcionado');
    }
    const nuevoToken = await this.authService.refrescar(tokenViejo);

    response.cookie('autorizacion', nuevoToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 15),
    });

    return {statusCode: HttpStatus.OK, message: 'Token refrescado'};
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('autorizacion', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(0),
    });

    return { statusCode: HttpStatus.OK, message: 'sesion cerrada' };
  }

  @Get('autorizar')
  async autorizar(@Req() request: Request) {
    const token = request.cookies['autorizacion'];

    if (!token) {
      throw new UnauthorizedException('no hay token de sesion');
    }

    const payloadToken = this.authService.verificarToken(token);

    const usuarioCompleto = await this.authService.buscarPorId(payloadToken.id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Token válido',
      data: usuarioCompleto
    };
  }
}