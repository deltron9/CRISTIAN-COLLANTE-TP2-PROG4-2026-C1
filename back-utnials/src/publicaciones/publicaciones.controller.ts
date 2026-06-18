import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacioneDto } from './dto/create-publicacione.dto';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';


@Controller('publicaciones')
@UseGuards(JwtGuard)
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  create(@Body() createDto: CreatePublicacioneDto, @Req() req: any) {
    const autorId = req.user.id;
    return this.publicacionesService.create(createDto, autorId);
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
}