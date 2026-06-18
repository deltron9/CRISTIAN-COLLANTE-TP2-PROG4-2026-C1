import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin/admin.guard';

@Controller('usuarios')
@UseGuards(JwtGuard, AdminGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }
  
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }
  
  @Post(':id/activar')
  activar(@Param('id') id: string) {
    return this.usuariosService.habilitar(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.deshabilitar(id);
  }
}
