import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolColor',
  standalone: true
})
export class RolColorPipe implements PipeTransform {

  transform(nombre: string | null | undefined, idAutor: string | null | undefined, usuarioLogueado: any): string {
    if (!nombre) return '';
    
    if (idAutor && usuarioLogueado && idAutor === usuarioLogueado._id && usuarioLogueado.perfil === 'admin') {
      return `${nombre} (Admin)`;
    }

    return nombre;
  }

}