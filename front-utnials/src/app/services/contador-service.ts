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

    const TIEMPO_ADVERTENCIA = 10 * 60 * 1000; 

    this.timerAdvertencia = setTimeout(async () => {
      
      const TIEMPO_DESPUES_ADVERTENCIA = 5 * 60 * 1000; 
      this.timerExpiracionFinal = setTimeout(() => {

        this.sesionExpirada.set(true); 
        this.limpiarTimers();
      }, TIEMPO_DESPUES_ADVERTENCIA);

      const quiereExtender = await this.alert.msjExpiracionSesion();

      if (quiereExtender) {
        this.notificarExtenderSesion();
      } else {
        this.sesionExpirada.set(true);
        this.alert.cerrarAlerta();
        this.limpiarTimers();
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
    if (window) {
      window.dispatchEvent(new CustomEvent('extender_sesion_click'));
    }
  }

  notificarCierreDefinitivo() {
    this.alert.cerrarAlerta();
    this.limpiarTimers();
    window.dispatchEvent(new CustomEvent('sesion_expirada_timeout'));
  }
}
