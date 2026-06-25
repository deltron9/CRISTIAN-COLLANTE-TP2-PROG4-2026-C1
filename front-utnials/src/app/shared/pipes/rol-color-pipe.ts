import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'rolColor',
  standalone: true
})
export class RolColorPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(nombre: string | null | undefined, idAutor: string | null | undefined, usuarioLogueado: any): SafeHtml | string {
    if (!nombre) return '';
    
    if (idAutor && usuarioLogueado && idAutor === usuarioLogueado._id && usuarioLogueado.perfil === 'admin') {
      const htmlConIcono = `${nombre} <i class="ri-shield-user-fill"></i>`;
      return this.sanitizer.bypassSecurityTrustHtml(htmlConIcono);
    }

    return nombre;
  }
}