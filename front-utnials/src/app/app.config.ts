import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authSesionInterceptor } from './auth/interceptors/auth-sesion-interceptor';
import { BaneadoInterceptor } from './auth/interceptors/baneado-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([BaneadoInterceptor, authSesionInterceptor])), 
  ]
};
