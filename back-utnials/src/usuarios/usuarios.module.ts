import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario, UsuarioSchema } from './entities/usuario.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]), AuthModule],
  controllers: [UsuariosController],
  providers: [UsuariosService, AuthService],
  exports: [UsuariosService]
})
export class UsuariosModule {}