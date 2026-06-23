import { inject, Injectable, signal } from '@angular/core';
import { AlertService } from './alert-service';

@Injectable({
  providedIn: 'root',
})
export class ContadorService {

  alert = inject(AlertService);
  sesionExpirada = signal<boolean>(false);
  timerAdvertencia: any;
  timerExpiracionFinal: any;

  iniciarContadores() {
    this.limpiarTimers();
    this.sesionExpirada.set(false);

    const TIEMPO_ADVERTENCIA = 10 * 1000;

    this.timerAdvertencia = setTimeout(async () => {
      
      const TIEMPO_DESPUES_ADVERTENCIA = 5 * 1000;
      
      this.timerExpiracionFinal = setTimeout(() => {
        this.notificarCierreDefinitivo();
      }, TIEMPO_DESPUES_ADVERTENCIA);

      const quiereExtender = await this.alert.msjExpiracionSesion();
      if (this.sesionExpirada()) return;

      this.limpiarTimers();

      if (quiereExtender) {
        this.notificarExtenderSesion();
      } else {
        this.notificarCierreDefinitivo();
      }

    }, TIEMPO_ADVERTENCIA);
  }

  reseteadoExitoso() {
    this.alert.cerrarAlerta();
    this.limpiarTimers();
  }

  limpiarTimers() {
    clearTimeout(this.timerAdvertencia);
    clearTimeout(this.timerExpiracionFinal);
  }

  notificarExtenderSesion() {
    this.limpiarTimers();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('extender_sesion_click'));
    }
  }

  notificarCierreDefinitivo() {
    this.sesionExpirada.set(true);
    this.limpiarTimers();
    this.alert.cerrarAlerta();
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sesion_expirada_timeout'));
    }
  }
}