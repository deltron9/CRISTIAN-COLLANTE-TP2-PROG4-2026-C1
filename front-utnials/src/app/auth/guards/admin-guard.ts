import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { inject } from '@angular/core/primitives/di';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.usuarioActual() && auth.usuarioActual()?.perfil === 'admin') {
    return true;
  }

  router.navigate(['/error-page']);
  return false;
};
