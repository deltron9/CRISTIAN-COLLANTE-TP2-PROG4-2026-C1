import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContadorService } from '../../services/contador-service';
import { AuthService } from '../auth-service';
import { AlertService } from '../../services/alert-service';
import { catchError, EMPTY, throwError } from 'rxjs';

let flagBaja = false;

export const BaneadoInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const timer = inject(ContadorService);
  const auth = inject(AuthService);
  const alert = inject(AlertService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 403) {
        const mensajeServidor = error.error?.message;

        if (flagBaja) return EMPTY;
        flagBaja = true;

        timer.limpiarTimers();
        auth.logout();

        router.navigate(['auth/login']).then(() => {
          alert.msjError(mensajeServidor).then(() => {
            flagBaja = false;
          }).catch(() => {
            flagBaja = false;
          });
        });

        return EMPTY; 
      }

      return throwError(() => error);
    })
  );
};