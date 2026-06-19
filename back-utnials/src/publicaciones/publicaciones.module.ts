import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './entities/publicacione.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [ MongooseModule.forFeature([{name: Publicacion.name, schema: PublicacionSchema}]), AuthModule, CloudinaryModule
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  exports: [PublicacionesService]
})
export class PublicacionesModule {}
