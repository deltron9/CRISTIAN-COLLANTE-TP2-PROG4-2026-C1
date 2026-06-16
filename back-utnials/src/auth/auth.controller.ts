import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly cloudinaryService: CloudinaryService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('profileImg'))
  async registrar(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUsuarioDto: CreateUsuarioDto
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

    return this.authService.registro(createUsuarioDto, urlImagen);
  }

  


}
