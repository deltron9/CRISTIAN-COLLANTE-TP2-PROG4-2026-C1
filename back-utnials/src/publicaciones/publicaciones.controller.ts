import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Req, ForbiddenException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaneadoGuard } from '../auth/guards/baneado/baneado.guard';
import { AdminGuard } from '../auth/guards/admin/admin.guard';


@Controller('publicaciones')
@UseGuards(JwtGuard, BaneadoGuard)
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService, private readonly cloudinaryService: CloudinaryService) {}

    @Post()
  @UseInterceptors(FileInterceptor('file')) 
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreatePublicacioneDto, 
    @Req() req: any
  ) {
    const autorId = req.user.id;
    let imagenUrl = '';

    if (file) {
      imagenUrl = await this.cloudinaryService.subirImagen(file, 'publicaciones');
    }

    return this.publicacionesService.create(createDto, autorId, imagenUrl);
  }

  @Get()
  findAll(
    @Query('limit') limit: string = '10', @Query('offset') offset: string = '0',
    @Query('sortBy') sortBy: string = 'fecha', @Query('userId') userId?: string,
  ) {
    return this.publicacionesService.findAll(+limit, +offset, sortBy, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicacionesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const usuarioLogueado = req.user;
    const publicacion = await this.publicacionesService.findOne(id);


    const esAutor = publicacion.autor._id.toString() === usuarioLogueado.id;
    const esAdmin = usuarioLogueado.perfil === 'admin';

    if (!esAutor && !esAdmin) {
      throw new ForbiddenException('no sos quien para dar de baja esta publicacion');
    }

    return this.publicacionesService.bajaLogica(id);
  }

  @Post(':id/like')
  darLike(@Param('id') id: string, @Req() req: any) {
    return this.publicacionesService.darLike(id, req.user.id);
  }

  @Delete(':id/like')
  quitarLike(@Param('id') id: string, @Req() req: any) {
    return this.publicacionesService.sacarLike(id, req.user.id);
  }

  @Get('estadisticas/usuarios')
  @UseGuards(AdminGuard)
  async obtenerEstadisticasUsuarios(@Query('dias') dias?: string) {
    const diasNum = dias ? parseInt(dias, 10) : undefined;
    return this.publicacionesService.obtenerEstadisticasUsuarios(diasNum);
  }
}