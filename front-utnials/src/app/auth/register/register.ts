import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Iregistrar } from '../iregistrar';
import { formUsuario } from '../../shared/form-registro';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  auth = inject(AuthService);
  ocultarPassword = signal(true);

  selectedFile: File | null = null;

  formRegistro = formUsuario();

async sendRegistro() {
    if (this.formRegistro.valid) {
      const { repetirPassword, ...datosLimpios } = this.formRegistro.value;
      await this.auth.registrar(datosLimpios as Iregistrar, this.selectedFile);
    } else {
      this.formRegistro.markAllAsTouched();
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.formRegistro.patchValue({ profileImg: this.selectedFile });
    }
  }

}
