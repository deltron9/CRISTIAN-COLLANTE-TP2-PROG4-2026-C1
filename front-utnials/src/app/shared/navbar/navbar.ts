import { Component, inject, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  auth = inject(AuthService);
  doc = inject(DOCUMENT); 
  modoOscuro: boolean = false;

  constructor() {
    effect(() => {
      const usuario = this.auth.usuarioActual();
      
      if (usuario) {
        const temaGuardado = localStorage.getItem('tema');
        if (temaGuardado === 'dark') {
          this.modoOscuro = true;
          this.doc.body.classList.add('dark-theme');
        } else {
          this.modoOscuro = false;
          this.doc.body.classList.remove('dark-theme');
        }
      } else {
        this.modoOscuro = false;
        this.doc.body.classList.remove('dark-theme');
      }
    });
  }

  toggleDarkMode() {
    if (!this.auth.usuarioActual()) return;

    this.modoOscuro = !this.modoOscuro;
    
    if (this.modoOscuro) {
      this.doc.body.classList.add('dark-theme');
      localStorage.setItem('tema', 'dark');
    } else {
      this.doc.body.classList.remove('dark-theme');
      localStorage.setItem('tema', 'light');
    }
  }

  cerrarSesionLimpiandoTema() {
    this.modoOscuro = false;
    this.doc.body.classList.remove('dark-theme');
    localStorage.removeItem('tema');
    this.auth.logout();
  }
}