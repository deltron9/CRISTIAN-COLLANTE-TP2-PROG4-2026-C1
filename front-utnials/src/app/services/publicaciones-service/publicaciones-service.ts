import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IPublicacion} from '../../services/publicaciones-service/ipublicacion'

@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {
  http = inject(HttpClient);
  url = `${environment.NG_APP_BACKEND_URL}/publicaciones`;
  
  publicacionesSignal = signal<IPublicacion[]>([]);
  publicaciones = this.publicacionesSignal.asReadonly();

  listar(limit: number = 5, offset: number = 0, sortBy: 'createdAt' | 'likesCantidad' = 'createdAt', userId?: string): Observable<IPublicacion[]> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString())
      .set('sortBy', sortBy);

    if (userId) {
      params = params.set('userId', userId);
    }

    return this.http.get<IPublicacion[]>(this.url, { params }).pipe(
      tap((publicaciones) => {
        if (offset === 0) {
          this.publicacionesSignal.set(publicaciones);
        } else {
          this.publicacionesSignal.set([...this.publicacionesSignal(), ...publicaciones]);
        }
      })
    );
  }

  obtenerTodas(): Observable<IPublicacion[]> {
    return this.http.get<IPublicacion[]>(`${this.url}/todas`);
  }

  obtenerPorId(id: string): Observable<IPublicacion> {
    return this.http.get<IPublicacion>(`${this.url}/${id}`);
  }

  crear(formData: FormData, imagenPrevisualizada?: string): Observable<IPublicacion> {
    return this.http.post<IPublicacion>(this.url, formData).pipe(
      tap((nuevaPublicacion) => {
        if (imagenPrevisualizada) {
          nuevaPublicacion.imagenUrl = imagenPrevisualizada;
        }
        this.publicacionesSignal.set([nuevaPublicacion, ...this.publicacionesSignal()]);}));
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`).pipe(
      tap(() => {
        this.publicacionesSignal.set(this.publicacionesSignal().filter((p) => p._id !== id));
      })
    );
  }

  darLike(id: string): Observable<IPublicacion> {
    return this.http.post<IPublicacion>(`${this.url}/${id}/like`, {}).pipe(
      tap((publicacionActualizada) => {
        this.actualizarPublicacion(publicacionActualizada);
      })
    );
  }

  sacarLike(id: string): Observable<IPublicacion> {
    return this.http.delete<IPublicacion>(`${this.url}/${id}/like`).pipe(
      tap((publicacionActualizada) => {
        this.actualizarPublicacion(publicacionActualizada);
      })
    );
  }

  actualizarPublicacion(publicacionActualizada: IPublicacion) {
    const publicaciones = this.publicacionesSignal();
    const index = publicaciones.findIndex((p) => p._id === publicacionActualizada._id);

    if (index !== -1) {
      const nuevasPublicaciones = [...publicaciones];
      nuevasPublicaciones[index] = publicacionActualizada;
      this.publicacionesSignal.set(nuevasPublicaciones);
    }
  }

  limpiarEstado() {
    this.publicacionesSignal.set([]);
  }
}