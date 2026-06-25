import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiempoRelativo',
  standalone: true
})
export class TiempoRelativoPipe implements PipeTransform {

  transform(fecha: string | Date | null | undefined): string {
    if (!fecha) return 'Hace un momento';

    const fechaPost = new Date(fecha);
    const ahora = new Date();
    const diferenciaSegundos = Math.floor((ahora.getTime() - fechaPost.getTime()) / 1000);

    if (diferenciaSegundos < 1) {
      return 'Ahora mismo';
    }

    if (diferenciaSegundos < 60) {
      return `Hace ${diferenciaSegundos} s`;
    }

    const diferenciaMinutos = Math.floor(diferenciaSegundos / 60);
    if (diferenciaMinutos < 60) {
      return `Hace ${diferenciaMinutos} min`;
    }

    const diferenciaHoras = Math.floor(diferenciaMinutos / 60);
    if (diferenciaHoras < 24) {
      return `Hace ${diferenciaHoras} h`;
    }

    const diferenciaDias = Math.floor(diferenciaHoras / 24);
    if (diferenciaDias === 1) {
      return 'Hace 1 día';
    }
    
    return `Hace ${diferenciaDias} días`;
  }

}