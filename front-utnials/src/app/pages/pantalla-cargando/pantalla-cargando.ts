import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Component({
  selector: 'app-pantalla-cargando',
  imports: [],
  templateUrl: './pantalla-cargando.html',
  styleUrl: './pantalla-cargando.css',
})
export class PantallaCargando {
  auth = inject(AuthService);
  router = inject(Router);

  async ngOnInit(): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const respuesta: any = await this.auth.validarAutorizacion();
      this.auth.establecerSesionLocal(respuesta.data);
      this.auth.sesionVerificada.set(true);
      this.router.navigate(['/publicaciones']);
    } catch (error) {
      console.log('error', error);
      this.auth.logout();
    }
  }
}
