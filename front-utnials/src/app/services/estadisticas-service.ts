import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

interface DataEstadistica {
  label: string;
  data: number;
}

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {

  urlBack = environment.NG_APP_BACKEND_URL;
  http = inject(HttpClient);

  getPublicacionesPorUsuario(dias: number): Observable<DataEstadistica[]> {
    return this.http.get<DataEstadistica[]>(`${this.urlBack}/publicaciones/estadisticas/usuarios?dias=${dias}`);
  }

  getComentariosTimeline(dias: number): Observable<DataEstadistica[]> {
    return this.http.get<DataEstadistica[]>(`${this.urlBack}/comentarios/estadisticas/timeline?dias=${dias}`);
  }

  getComentariosPorPublicacion(dias: number): Observable<DataEstadistica[]> {
    return this.http.get<DataEstadistica[]>(`${this.urlBack}/comentarios/estadisticas/por-publicacion?dias=${dias}`);
  }
}
