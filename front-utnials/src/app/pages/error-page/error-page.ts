import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-error-page',
  imports: [],
  templateUrl: './error-page.html',
  styleUrl: './error-page.css',
})
export class ErrorPage {
  location = inject(Location)

  volverAtras() {
    this.location.back(); 
  }

}
