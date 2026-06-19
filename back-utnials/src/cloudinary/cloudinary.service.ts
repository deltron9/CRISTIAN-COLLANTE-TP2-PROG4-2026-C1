import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {

  async subirImagen(file: Express.Multer.File, folderName: string): Promise<string> {
      
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API,
        api_secret: process.env.CLOUD_API_SECRET,
    });

    if (!file) {
        throw new BadRequestException('No se subio ningun archivo');
    }

    if (file.size > 2 * 1024 * 1024) {
        throw new BadRequestException('el archivo no puede superar los 2MB');
    }

    const tiposPermitidos = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!tiposPermitidos.includes(file.mimetype)) {
        throw new BadRequestException('tipo no permitido');
    }

    const public_id = `IMG_${Date.now()}_archivos`;

    return new Promise((resolve, reject) => {
      const uploader = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          public_id: public_id,
          analytics: false
        },
        (error, result) => {
          if (error) {
            return reject(new BadRequestException('Error al procesar en Cloudinary'));
          }
          
          if (result && result.secure_url) {
            let urlLimpia = result.secure_url;
            if (urlLimpia.includes('?')) {
              urlLimpia = urlLimpia.split('?')[0];
            }
            

            return resolve(urlLimpia);
          }
          
          reject(new BadRequestException('No se pudo recuperar la URL del archivo'));
        }
      );


      uploader.end(file.buffer);
    });
  }
}