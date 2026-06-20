import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IComentario, IComentarioListaResponse } from '../comentario-service/i-comentario'

@Injectable({
  providedIn: 'root',
})
export class ComentariosService {
  http = inject(HttpClient);
  apiUrl = `${environment.NG_APP_BACKEND_URL}/comentarios`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  listarPorPublicacion(publicacionId: string, limit: number = 3, offset: number = 0): Observable<IComentarioListaResponse> {
    const params = new HttpParams().set('limit', limit.toString()).set('offset', offset.toString());

    return this.http.get<IComentarioListaResponse>(`${this.apiUrl}/publicacion/${publicacionId}`, {params, headers: this.getHeaders()});
  }

  contarPorPublicacion(publicacionId: string): Observable<IComentarioListaResponse> {
    const params = new HttpParams().set('limit', '1').set('offset', '0');
    return this.http.get<IComentarioListaResponse>(`${this.apiUrl}/publicacion/${publicacionId}`, {params, headers: this.getHeaders()});
  }

  crear(publicacionId: string, texto: string): Observable<IComentario> {
    return this.http.post<IComentario>(`${this.apiUrl}/publicacion/${publicacionId}`, { texto }, {headers: this.getHeaders()});
  }

  actualizar(comentarioId: string, texto: string): Observable<IComentario> {
    return this.http.patch<IComentario>(`${this.apiUrl}/${comentarioId}`,{texto }, {headers: this.getHeaders()});
  }

  eliminar(comentarioId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${comentarioId}`, { headers: this.getHeaders() });
  }

  obtenerTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {headers: this.getHeaders()});
  }
}