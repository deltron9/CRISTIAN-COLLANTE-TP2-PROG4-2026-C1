import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service';

export const RutasParaLogeadosGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const usuarioLogeado = auth.usuarioActual();
  
  const pathActual = route.routeConfig?.path;
  const esRutaSinSesion = pathActual === 'login' || pathActual === 'register';

  if (esRutaSinSesion) {
    if (usuarioLogeado) {
      router.navigate(['/publicaciones']);
      return false;
    }
    return true;
  }

  if (usuarioLogeado) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};