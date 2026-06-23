import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContadorService } from '../../services/contador-service';
import { AuthService } from '../auth-service';
import { AlertService } from '../../services/alert-service';
import { catchError, throwError } from 'rxjs';

let flagError401 = false;

export const authSesionInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const timer = inject(ContadorService);
  const auth = inject(AuthService);
  const alert = inject(AlertService);

  const reqConCookies = req.clone({ withCredentials: true });

  return next(reqConCookies).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('error 401 caporal');

        if (flagError401) {
          return throwError(() => error);
        }
        
        flagError401 = true;
        timer.limpiarTimers();
        auth.logout();

        router.navigate(['auth/login']).then(() => {
          alert.msjErrorSesion().then(() => {
            flagError401 = false;
          }).catch(() => {
            flagError401 = false;
          });
        });
      }

      return throwError(() => error);
    })
  );
};