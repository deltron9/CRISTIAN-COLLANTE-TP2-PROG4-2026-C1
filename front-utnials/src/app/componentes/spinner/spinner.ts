import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  template: `
    @if (visible) {
      <div class="spinner-overlay">
        <div class="brutal-spinner-box">
          <div class="spinner-cubo"></div>
          <p class="texto-carga">Cargando...</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    .brutal-spinner-box {
      background: #ffffff;
      border: 4px solid #000000;
      box-shadow: 8px 8px 0px #000000;
      padding: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    :host-context(body.dark-theme) .brutal-spinner-box {
      background: var(--color-primario, #1a1a1a);
      border-color: var(--color-borde-btn, #475569);
      box-shadow: 8px 8px 0px var(--fondo-btn, rgb(5, 38, 100));
    }
    .spinner-cubo {
      width: 40px;
      height: 40px;
      background-color: #ffa6d1;
      border: 3px solid #000000;
      animation: rotarCubo 0.8s infinite linear;
    }
    :host-context(body.dark-theme) .spinner-cubo {
      background-color: #b53fa7;
      border-color: #f8fafc;
    }
    .texto-carga {
      font-family: monospace;
      font-weight: 900;
      text-transform: uppercase;
      font-size: 1.1rem;
      margin: 0;
      color: #000000;
    }
    :host-context(body.dark-theme) .texto-carga {
      color: var(--color-blanco, #f8fafc);
    }
    @keyframes rotarCubo {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {
  @Input() visible = false;
}