import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

export function formUsuario(): FormGroup {
  return new FormGroup({
    nombre: new FormControl('', [
      Validators.required, 
      Validators.minLength(3), 
      Validators.maxLength(20), 
      Validators.pattern('^[a-zA-Z]*$')
    ]),
    apellido: new FormControl('', [
      Validators.required, 
      Validators.minLength(3), 
      Validators.maxLength(20), 
      Validators.pattern('^[a-zA-Z]*$')
    ]),
    email: new FormControl('', [
      Validators.required, 
      Validators.email
    ]),
    username: new FormControl('', [
      Validators.required, 
      Validators.minLength(8), 
      Validators.maxLength(15), 
      Validators.pattern('^[a-zA-Z0-9_\\-\\.\\@]+$')
    ]),
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(8), 
      Validators.maxLength(20),
      Validators.pattern('^(?=.*[A-Z])(?=.*\\d)[a-zA-Z0-9]*$')
    ]),
    repetirPassword: new FormControl('', [
      Validators.required
    ]),
    fechaNacimiento: new FormControl('', [
      Validators.required
    ]),
    descripcion: new FormControl('', [
      Validators.minLength(4), 
      Validators.maxLength(150)
    ])
  }, { 
    validators: validarRepetirPassword
  });
}

function validarRepetirPassword(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('repetirPassword')?.value;
  return password === confirmPassword ? null : { noMatch: true };
}