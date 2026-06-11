import { Module, Global } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Module({ providers: [CloudinaryService], 
    exports: [CloudinaryService],
})
export class CloudinaryModule {}