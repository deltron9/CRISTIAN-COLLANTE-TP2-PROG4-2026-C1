import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { UsuariosService } from './usuarios/usuarios.service';
import { MongooseModule as mongooseModule } from '@nestjs/mongoose';
import { ConfigModule as configModule } from '@nestjs/config';
import { PublicacionesService } from './publicaciones/publicaciones.service';
import { AuthModule } from './auth/auth.module';
import { ComentariosModule } from './comentarios/comentarios.module';

@Module({
  imports: [UsuariosModule, configModule.forRoot(), mongooseModule.forRoot(process.env.MONGO_URI!), AuthModule, ComentariosModule],
  controllers: [AppController],
  providers: [AppService, UsuariosService, PublicacionesService],
})
export class AppModule {}
