import { Component, computed, inject, input } from '@angular/core';
import { PublicacionesService } from '../../services/publicaciones-service/publicaciones-service';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-publicaciones-card',
  imports: [],
  templateUrl: './publicaciones-card.html',
  styleUrl: './publicaciones-card.css',
})
export class PublicacionesCard {

  publis = inject(PublicacionesService);
  auth = inject(AuthService);

  idPublicacion = input<string>('');
  avatarAutor = input<string>('/assets/default-avatar.webp');
  nombreAutor = input<string>('Usuario Anónimo');
  usernameAutor = input<string>('anonimo');
  fechaCreacion = input<string>('');
  tituloPost = input<string>('Sin título');
  contenidoPost = input<string>('Este posteo no tiene contenido.');
  imagenPost = input<string>('');
  textButtonLike = input<string>('Me gusta');
  usuarioLogueado = this.auth.usuarioActual;
  likesArray = input<string[]>([]);
  likesCount = input<number>(0);
  autorId = input<string>('');

  esMiPublicacion = computed(() => {
    const usuario = this.usuarioLogueado();
    return usuario && this.autorId() === usuario._id;
  });

  esAdministrador = computed(() => {
    const usuario = this.usuarioLogueado();
    return usuario?.perfil === 'admin';
  });

  puedeEliminar = computed(() => {
    return this.esMiPublicacion() || this.esAdministrador();
  });

  tieneLike = computed(() => {
    const usuario = this.usuarioLogueado();
    if (!usuario) return false;
    return this.likesArray().includes(usuario._id);
  });

  darLike() {
    if (!this.idPublicacion()) return;
    
    if (this.tieneLike()) {
      this.publis.sacarLike(this.idPublicacion()).subscribe();
    } else {
      this.publis.darLike(this.idPublicacion()).subscribe();
    }
  }

  eliminarPublicacion() {
    if (!this.idPublicacion()) return;

    if (confirm('¿Estas seguro de que deseas borrar esta publicacion?')) {
      this.publis.eliminar(this.idPublicacion()).subscribe();
    }
  }
}
