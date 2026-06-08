import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  async msjSuccess(mensaje: string): Promise<void> {
    await Swal.fire({
      icon: 'success',
      title: '¡Operación Exitosa!',
      text: mensaje,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      heightAuto: false,
      background: '#ffffff',
      backdrop: `rgba(0, 0, 0, 0.4)`
    });
  }

  async msjError(mensaje: string): Promise<void> {
    await Swal.fire({
      icon: 'error',
      title: 'Hubo un problema',
      text: mensaje,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      heightAuto: false,
      background: '#ffffff',
      backdrop: `rgba(0, 0, 0, 0.4)`
    });
  }

  async msjWarning(mensaje: string): Promise<void> {
    await Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: mensaje,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      heightAuto: false,
      background: '#ffffff',
      backdrop: `rgba(0, 0, 0, 0.4)`
    });
  }

}
