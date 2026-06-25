import { Controller, Get, Param, Delete, Post, Body, UseGuards, HttpCode, HttpStatus, UseInterceptors, UploadedFile, BadRequestException, Put, Req, UnauthorizedException} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Express } from 'express';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { AdminGuard } from '../auth/guards/admin/admin.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  @Get('perfil')
  @UseGuards(JwtGuard)
  async obtenerPerfil(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('Usuario no identificado');

    const usuario = await this.usuariosService.findOne(userId);
    let usuarioSinPassword = null;
    if (usuario) {
      const { password, ...resto } = (usuario as any).toObject();
      usuarioSinPassword = resto;
    }

    return {
      statusCode: HttpStatus.OK,
      data: usuarioSinPassword,
    };
  }

  @Get()
  @UseGuards(JwtGuard, AdminGuard)
  async findAll() {
    const usuarios = await this.usuariosService.findAll();
    
    const usuariosLimpios = usuarios.map(u => {
      const { password, ...resto } = (u as any).toObject();
      return resto;
    });

    return {
      statusCode: HttpStatus.OK,
      data: usuariosLimpios,
    };
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async findOne(@Param('id') id: string) {
    const usuario = await this.usuariosService.findOne(id);
    let usuarioSinPassword = null;
    if (usuario) {
      const { password, ...resto } = (usuario as any).toObject();
      usuarioSinPassword = resto;
    }

    return {
      statusCode: HttpStatus.OK,
      data: usuarioSinPassword,
    };
  }

  @Post()
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('profileImg', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(
            new BadRequestException('Solo se permiten imágenes JPG o PNG'),
            false,
          );
        } else {
          cb(null, true);
        }
      },
    }),
  )

  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imagenUrl: string;

    if (file) {
      imagenUrl = ''; 
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
      imagenUrl = AVATARES_DEFAULT[random];
    }

    const usuario = await this.usuariosService.create(createUsuarioDto, imagenUrl, false);

    const usuarioObj = (usuario as any).toObject();
    const { password, ...usuarioSinPassword } = usuarioObj;

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Usuario creado exitosamente',
      data: usuarioSinPassword,
    };
  }

  @Put(':id')
  @UseGuards(JwtGuard, AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const usuarioActualizado = await this.usuariosService.update(id, updateUsuarioDto);
    let usuarioSinPassword = null;
    if (usuarioActualizado) {
      const { password, ...resto } = (usuarioActualizado as any).toObject();
      usuarioSinPassword = resto;
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Usuario actualizado exitosamente',
      data: usuarioSinPassword,
    };
  }

  @Delete(':id/baja')
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async baja(@Param('id') id: string) {
    const resultado = await this.usuariosService.deshabilitar(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Usuario dado de baja correctamente',
      data: resultado,
    };
  }

  @Post(':id/alta')
  @UseGuards(JwtGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async alta(@Param('id') id: string) {
    const resultado = await this.usuariosService.habilitar(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Usuario reactivado correctamente',
      data: resultado,
    };
  }
}