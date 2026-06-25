import { Component, inject, input, signal, OnInit } from '@angular/core';
import { PublicacionesService } from '../../services/publicaciones-service/publicaciones-service';
import { AuthService } from '../../auth/auth-service';
import { ComentariosService } from '../../services/comentario-service/comentarios-service';
import { IComentario } from '../../services/comentario-service/i-comentario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecortarTextoPipe } from '../../shared/pipes/recortar-texto-pipe';
import { TiempoRelativoPipe } from '../../shared/pipes/tiempo-relativo-pipe';
import { RolColorPipe } from '../../shared/pipes/rol-color-pipe';

@Component({
  selector: 'app-publicaciones-card',
  standalone: true,
  imports: [CommonModule, FormsModule, TiempoRelativoPipe, RecortarTextoPipe, RolColorPipe],
  templateUrl: './publicaciones-card.html',
  styleUrl: './publicaciones-card.css',
})
export class PublicacionesCard implements OnInit {
  publis = inject(PublicacionesService);
  auth = inject(AuthService);
  com = inject(ComentariosService);

  idPublicacion = input<string>('');
  avatarAutor = input<string>('');
  nombreAutor = input<string>('rox trongo');
  usernameAutor = input<string>('RoxTrongo');
  fechaCreacion = input<string>('');
  tituloPost = input<string>('aca tendria que ir un titulo');
  contenidoPost = input<string>('este posteo no tiene contenido');
  imagenPost = input<string>('');
  textButtonLike = input<string>('');
  likesArray = input<string[]>([]);
  likesCount = input<number>(0);
  autorId = input<string>('');  
  usuarioLogueado = this.auth.usuarioActual;
  modalAbierto = signal(false);
  listaComentarios = signal<IComentario[]>([]);
  totalComentariosCount = signal(0);
  hayMasComentarios = signal(true);
  comentarioEnEdicionId = signal<string | null>(null);
  nuevoComentarioTexto = signal('');

  limit = 3;
  offset = 0;

  ngOnInit() {
    if (!this.idPublicacion()) return;
    this.com.listarPorPublicacion(this.idPublicacion(), 1, 0).subscribe(res => {
      if (res) this.totalComentariosCount.set(res.total);
    });
  }

  esAdministrador(): boolean {
    return this.usuarioLogueado()?.perfil === 'admin';
  }

  puedeEliminarPublicacion(): boolean {
    const user = this.usuarioLogueado();
    if (!user) return false;
    return this.autorId() === user._id || this.esAdministrador();
  }

  tieneLike(): boolean {
    const user = this.usuarioLogueado();
    return user ? this.likesArray().includes(user._id) : false;
  }

  darLike() {
    if (!this.idPublicacion()) return;
    const peticion = this.tieneLike() ? this.publis.sacarLike(this.idPublicacion()) : this.publis.darLike(this.idPublicacion());
    peticion.subscribe();
  }

  eliminarPublicacion() {
    if (this.idPublicacion()) { //tengo que meter alerta de confirmacion
      this.publis.eliminar(this.idPublicacion()).subscribe();
    }
  }

  abrirModal() {
    this.modalAbierto.set(true);
    document.body.style.overflow = 'hidden';
    this.offset = 0;
    this.listaComentarios.set([]);
    
    this.com.listarPorPublicacion(this.idPublicacion(), this.limit, this.offset).subscribe(res => {
      if (res?.comentarios) {
        this.listaComentarios.set(res.comentarios);
        this.totalComentariosCount.set(res.total);
        this.hayMasComentarios.set(this.listaComentarios().length < res.total);
      }
    });
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    document.body.style.overflow = 'auto';
    this.comentarioEnEdicionId.set(null);
  }

  cargarMasComentarios() {
    this.offset += this.limit;
    this.com.listarPorPublicacion(this.idPublicacion(), this.limit, this.offset).subscribe(res => {
      if (!res || !res.comentarios.length) {
        this.hayMasComentarios.set(false);
        return;
      }
      this.listaComentarios.update(act => [...act, ...res.comentarios]);
      this.hayMasComentarios.set(this.listaComentarios().length < res.total);
    });
  }

  agregarComentario() {
    const texto = this.nuevoComentarioTexto().trim();
    if (!texto) return;

    this.com.crear(this.idPublicacion(), texto).subscribe(comentarioNuevo => {
      this.listaComentarios.update(act => [comentarioNuevo, ...act]);
      this.totalComentariosCount.update(c => c + 1);
      this.nuevoComentarioTexto.set('');
    });
  }

  guardarEdicion(comentarioId: string, textoModificado: string) {
    const texto = textoModificado.trim();
    if (!texto) return;

    this.com.actualizar(comentarioId, texto).subscribe(comentarioActualizado => {
      this.listaComentarios.update(act => act.map(c => c._id === comentarioId ? comentarioActualizado : c));
      this.comentarioEnEdicionId.set(null);
    });
  }

  eliminarComentario(comentarioId: string) {

    //tengo que meter una alerta para confirmar la baja

    this.com.eliminar(comentarioId).subscribe(() => {
      this.listaComentarios.update(act => act.filter(c => c._id !== comentarioId));
      this.totalComentariosCount.update(c => c - 1);
    });
  }
}