import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  urlBack = (import.meta as any).env.NG_APP_BACKEND_URL;

  constructor(){

  }

  registrar(){

  }

  logear(){

  }


}
