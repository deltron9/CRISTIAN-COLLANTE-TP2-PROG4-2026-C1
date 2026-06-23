import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from './entities/comentario.entity';
import { PublicacionesModule } from '../publicaciones/publicaciones.module';
import { AuthModule } from '../auth/auth.module'; 

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
