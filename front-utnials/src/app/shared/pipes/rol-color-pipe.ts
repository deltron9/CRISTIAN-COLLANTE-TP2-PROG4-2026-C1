import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolColor',
  standalone: true
})
export class RolColorPipe implements PipeTransform {

  transform(esAdmin: boolean | string | null | undefined): string {
    if (esAdmin === true || esAdmin === 'admin') {
      return '#ff4d4d';
    }

    return 'inherit'; 
  }

}