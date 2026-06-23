import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Iregistrar } from './iregistrar';
import { firstValueFrom } from 'rxjs';
import { AlertService } from '../services/alert-service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { IUsuario } from './i-usuario';
import { ContadorService } from '../services/contador-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  alert = inject(AlertService);
  router = inject(Router)
  timer = inject(ContadorService)

  urlBack = environment.NG_APP_BACKEND_URL;
  usuarioActual = signal<IUsuario | null>(null);

  constructor() {
    const usuarioGuardado = sessionStorage.getItem('user_session');
    if (usuarioGuardado) {
      this.usuarioActual.set(JSON.parse(usuarioGuardado));
      this.timer.iniciarContadores();
    }

    window.addEventListener('extender_sesion_click', () => this.extenderSesion());
    window.addEventListener('sesion_expirada_timeout', () => this.logout());
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
      
      if (response) {
        this.establecerSesionLocal(response); 
      }

      const usernameCreado = response?.username || usuario.username;
      
      await this.alert.msjSuccess(`¡Bienvenido a utnials, ${usernameCreado}!`);
      this.router.navigateByUrl('/publicaciones'); //tengo que cambiar por pagina de carga a futuro

    } catch (error: any) {
      await this.alert.msjError(error.error?.message || 'Error al registrarse');
    }
  }

  async logear(credenciales: { identificador: string; passwordIngresada: string }): Promise<void> {
  try {
    const usuario = await firstValueFrom(
      this.http.post<any>(`${this.urlBack}/auth/login`, credenciales)
    );

    if (usuario) {
      this.establecerSesionLocal(usuario);
    }

    this.router.navigateByUrl('/publicaciones'); //tengo que agregar la pagina de carga

  } catch (error: any) {
    await this.alert.msjError(error.error?.message || 'Error al iniciar sesion');
  }
}

logout() {
  this.timer.limpiarTimers();
  sessionStorage.removeItem('user_session');
  this.usuarioActual.set(null);
  this.router.navigate(['auth/login']);
  
  this.http.post(`${this.urlBack}/auth/logout`, {}, { withCredentials: true }).subscribe({
    next: () => console.log('cookie eliminada'),
    error: (err) => console.log('error, o paso algo con la cookie', err)
  });
}

  async refrescarToken() {
    try {
      await firstValueFrom(this.http.post(`${this.urlBack}/refrescar`, {}));
      this.timer.iniciarContadores(); 
    } catch {
      this.logout();
    }
  }

  async extenderSesion() {
    this.timer.reseteadoExitoso();
    await this.refrescarToken();
  }

  establecerSesionLocal(usuario: IUsuario) {
    this.usuarioActual.set(usuario);
    sessionStorage.setItem('user_session', JSON.stringify(usuario));
    this.timer.iniciarContadores(); 
  }

  async validarAutorizacion(): Promise<IUsuario> {
    return await firstValueFrom(
      this.http.get<IUsuario>(`${this.urlBack}/auth/autorizar`, { withCredentials: true })
    );
  }

}
