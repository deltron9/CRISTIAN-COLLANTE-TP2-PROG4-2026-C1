import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service';

export const RutasParaLogeadosGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const usuarioLogeado = auth.usuarioActual();
  const sesionVerificada = auth.sesionVerificada();
  
  const pathActual = route.routeConfig?.path;
  const esRutaSinSesion = pathActual === 'login' || pathActual === 'register';
  const pantallaCargando = pathActual === 'pantalla-cargando';

  if (pantallaCargando) {
    if (usuarioLogeado && sesionVerificada) {
      router.navigate(['/publicaciones']);
      return false;
    }
    if (usuarioLogeado && !sesionVerificada) {
      return true;
    }
    router.navigate(['/auth/login']);
    return false;
  }

  if (esRutaSinSesion) {
    if (usuarioLogeado && sesionVerificada) {
      router.navigate(['/publicaciones']);
      return false;
    }
    return true; 
  }

  if (usuarioLogeado && sesionVerificada) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};