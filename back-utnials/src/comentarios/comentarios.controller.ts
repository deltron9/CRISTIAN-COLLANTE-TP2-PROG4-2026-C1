import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';

@Controller('comentarios')
@UseGuards(JwtGuard)
export class ComentariosController {
  constructor(private comentariosService: ComentariosService) {}

  @Post('publicacion/:publicacionId')
  crear(
    @Param('publicacionId') publicacionId: string,
    @Body() createComentarioDto: CreateComentarioDto,
    @Req() req: any
  ) {
    const autorId = req.user.id;
    return this.comentariosService.crear(createComentarioDto, autorId, publicacionId);
  }

  @Get('publicacion/:publicacionId')
  listarPorPublicacion(
    @Param('publicacionId') publicacionId: string,
    @Query('limit') limit: string = '3',
    @Query('offset') offset: string = '0'
  ) {
    return this.comentariosService.listarPorPublicacion(publicacionId, +limit, +offset);
  }

  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() updateComentarioDto: UpdateComentarioDto,
    @Req() req: any
  ) {
    const userId = req.user.id;
    return this.comentariosService.actualizar(id, updateComentarioDto, userId);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.perfil;
    return this.comentariosService.eliminar(id, userId, userRole);
  }
}