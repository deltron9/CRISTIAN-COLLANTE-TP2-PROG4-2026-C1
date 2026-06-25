import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../usuarios/entities/usuario.entity';
@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, MongooseModule]
})
export class AuthModule {}