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

  async msjExpiracionSesion(): Promise<boolean> {
    const resultado = await Swal.fire({
      icon: 'warning',
      title: 'Tu sesion esta por expirar',
      text: 'Por razones de seguridad, tu sesion finaliza en 5 minutos por inactividad. ¿Queres seguir conectado?',
      showCancelButton: true,
      confirmButtonText: 'extender sesion',
      cancelButtonText: 'cerrar sesion',
      confirmButtonColor: '#1877f2',
      cancelButtonColor: '#dc3545',
      heightAuto: false,
      background: '#ffffff',
      backdrop: `rgba(15, 23, 42, 0.75)`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      stopKeydownPropagation: true
    });

    return resultado.isConfirmed;
  }

  cerrarAlerta(){
    Swal.close();
  }

}
