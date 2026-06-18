import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { AlertService } from '../../services/alert-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  auth = inject(AuthService);
  alert = inject(AlertService);
  router = inject(Router);

  formLogin = new FormGroup({
    usuario: new FormControl('', [
      Validators.required, Validators.minLength(4), Validators.maxLength(50), 
      Validators.pattern('^[a-zA-Z0-9_\\-\\.\\@\\+]+$')]),
      
    password: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$'), 
      Validators.minLength(8), Validators.maxLength(20)])});

  async sendForm() {
    if (this.formLogin.invalid) {
      this.alert.msjWarning('Por favor, revisa los campos ingresados');
      return;
    }

    const credenciales = {identificador: this.formLogin.value.usuario!, passwordIngresada: this.formLogin.value.password!};
    await this.auth.logear(credenciales);
  }
}