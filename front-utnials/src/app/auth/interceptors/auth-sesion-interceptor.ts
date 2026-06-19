import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContadorService } from '../../services/contador-service';
import { AuthService } from '../auth-service';
import { AlertService } from '../../services/alert-service';
import { catchError, throwError } from 'rxjs';

let redirectingTo401 = false;

export const authSesionInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const timer = inject(ContadorService);
  const auth = inject(AuthService);
  const alert = inject(AlertService);

  const reqConCookies = req.clone({withCredentials: true});

  return next(reqConCookies).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('error:', error.status);

        if (redirectingTo401) {
          return throwError(() => error);
        }
        redirectingTo401 = true;

        timer.limpiarTimers();
        auth.logout();

        alert.msjErrorSesion().then(() => {
          router.navigate(['auth/login']).then(() => {
            redirectingTo401 = false;
          });
        });
      }

      return throwError(() => error);
    })
  );
};
