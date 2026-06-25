import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../auth/auth-service';
import { IUsuario} from './iusuario';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private apiUrl = `${this.auth.urlBack}/usuarios`;

  httpOptions = {withCredentials: true};

  obtenerPerfil(): Observable<IUsuario> {
    return this.http.get<{ data: IUsuario }>(`${this.apiUrl}/perfil`, this.httpOptions).pipe(
      map(res => res.data)
    );
  }

  obtenerPorId(id: string): Observable<IUsuario> {
    return this.http.get<{ data: IUsuario }>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      map(res => res.data)
    );
  }

  obtenerPorUsername(username: string): Observable<IUsuario> {
    return this.http.get<{ data: IUsuario }>(`${this.apiUrl}/username/${username}`, this.httpOptions).pipe(
      map(res => res.data)
    );
  }

  listarTodos(): Observable<IUsuario[]> {
    return this.http.get<{ data: IUsuario[] }>(this.apiUrl, this.httpOptions).pipe(
      map(res => res.data)
    );
  }

  crear(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario, this.httpOptions);
  }

  deshabilitarUsuario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/baja`, this.httpOptions);
  }

  habilitarUsuario(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/alta`, {}, this.httpOptions);
  }
}