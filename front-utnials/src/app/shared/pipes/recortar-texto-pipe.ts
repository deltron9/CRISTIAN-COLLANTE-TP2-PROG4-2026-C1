import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recortarTexto',
  standalone: true
})
export class RecortarTextoPipe implements PipeTransform {

  transform(valor: string, limite: number = 100): string {
    if (!valor) return '';
    
    return valor.length > limite 
      ? valor.substring(0, limite) + '...' 
      : valor;
  }

}