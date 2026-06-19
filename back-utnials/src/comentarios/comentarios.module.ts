import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from './entities/comentario.entity';
import { PublicacionesModule } from 'src/publicaciones/publicaciones.module';
import { AuthModule } from 'src/auth/auth.module'; // <-- Importamos AuthModule

@Module({
  imports: [ 
    MongooseModule.forFeature([{ name: Comentario.name, schema: ComentarioSchema }]), 
    PublicacionesModule,
    AuthModule],
  controllers: [ComentariosController],
  providers: [ComentariosService],
  exports: [ComentariosService]
})
export class ComentariosModule {}
