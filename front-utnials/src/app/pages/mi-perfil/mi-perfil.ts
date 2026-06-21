import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicacionesService } from '../../services/publicaciones-service/publicaciones-service';
import { AuthService } from '../../auth/auth-service';
import { PublicacionesCard } from '../../componentes/publicaciones-card/publicaciones-card';
import { IPublicacion } from '../../services/publicaciones-service/ipublicacion';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, PublicacionesCard],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css'
})
export class MiPerfil implements OnInit {
  publis = inject(PublicacionesService);
  auth = inject(AuthService);

  usuarioLogueado = this.auth.usuarioActual;
  misPublicaciones = signal<IPublicacion[]>([]);

  ngOnInit(): void {
    const usuario = this.usuarioLogueado();
    if (usuario && usuario._id) {
      this.cargarMisUltimasPublicaciones(usuario._id);
    }
  }

  cargarMisUltimasPublicaciones(userId: string): void {
    this.publis.listar(3, 0, 'createdAt', userId).subscribe(res => this.misPublicaciones.set(res));
  }
}