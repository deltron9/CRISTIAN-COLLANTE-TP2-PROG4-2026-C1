import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Iregistrar } from './iregistrar';
import { firstValueFrom } from 'rxjs';
import { AlertService } from '../services/alert-service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  alert = inject(AlertService);
  router = inject(Router)

  urlBack = environment.NG_APP_BACKEND_URL;

  constructor(){
    
  }

  async registrar(usuario: Iregistrar, file: File | null): Promise<void> {
    const data = new FormData();

    data.append('nombre', usuario.nombre);
    data.append('apellido', usuario.apellido);
    data.append('email', usuario.email);
    data.append('username', usuario.username);
    data.append('password', usuario.password);
    data.append('fechaNacimiento', usuario.fechaNacimiento);
    data.append('descripcion', usuario.descripcion);

    if (file) {
      data.append('profileImg', file); 
    }

    try {
      const response = await firstValueFrom(this.http.post<any>(`${this.urlBack}/auth/register`, data));
      
      const usernameCreado = response.usuario?.username || usuario.username;
      
      await this.alert.msjSuccess(`¡Bienvenido a utnials, ${usernameCreado}!`);
      this.router.navigateByUrl('/publicaciones');

    } catch (error: any) {
      await this.alert.msjError(error.error?.message || 'Error al registrar');
    }
  }

  logear(){

  }


}
