import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Iregistrar } from '../iregistrar';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  auth = inject(AuthService);

  selectedFile: File | null = null;

  formRegistro = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20), 
      Validators.pattern('^[a-zA-Z]*$')]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20), 
      Validators.pattern('^[a-zA-Z]*$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15), 
      Validators.pattern('^[a-zA-Z0-9_\\-\\.\\@]+$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20),
      Validators.pattern('^(?=.*[A-Z])(?=.*\\d)[a-zA-Z0-9]*$')]),
    repetirPassword: new FormControl('', [Validators.required]),
    fechaNacimiento: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    profileImg: new FormControl<any>(null)
  }, { 
    validators: this.validarRepetirPassword
  });

  async sendRegistro() {
    if (this.formRegistro.valid) {
      await this.auth.registrar(this.formRegistro.value as Iregistrar, this.selectedFile);
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

  validarRepetirPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('repetirPassword')?.value;

    return password === confirmPassword ? null : { noMatch: true };
  }
}
