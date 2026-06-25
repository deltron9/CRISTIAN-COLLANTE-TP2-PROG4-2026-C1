import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { AuthService } from './auth/auth-service';
import { SpinnerComponent } from './componentes/spinner/spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, SpinnerComponent], // 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('utnials');
  auth = inject(AuthService);
  router = inject(Router);

  isCargando = signal<boolean>(false);

  ngOnInit() {
    this.router.events.subscribe(event => {
      const estaLogueado = !!this.auth.usuarioActual();

      if (estaLogueado) {
        if (event instanceof NavigationStart) {
          this.isCargando.set(true);
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          setTimeout(() => {
            this.isCargando.set(false);
          }, 150);
        }
      } else {
        this.isCargando.set(false);
      }
    });
  }
}