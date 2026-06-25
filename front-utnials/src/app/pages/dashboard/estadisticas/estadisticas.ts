import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasService } from '../../../services/estadisticas-service';
import Chart, { registerables } from 'chart.js/auto';

Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class Estadisticas implements OnInit {
  charts: { [key: string]: Chart } = {};
  stats = inject(EstadisticasService);

  pestanaActiva = signal<string>('publicaciones');

  ngOnInit() {
    this.cambiarPestana('publicaciones');
  }

  cambiarPestana(pestana: string) {
    this.pestanaActiva.set(pestana);
    
    setTimeout(() => {
      if (pestana === 'publicaciones') this.cargarPublicaciones(7);
      if (pestana === 'comentarios') this.cargarComentarios(7);
      if (pestana === 'por-publicacion') this.cargarComentariosPorPublicacion(7);
    }, 20);
  }

  onPublicacionesChange(event: Event) {
    const dias = +(event.target as HTMLSelectElement).value;
    this.cargarPublicaciones(dias);
  }

  onComentariosChange(event: Event) {
    const dias = +(event.target as HTMLSelectElement).value;
    this.cargarComentarios(dias);
  }

  onPorPublicacionChange(event: Event) {
    const dias = +(event.target as HTMLSelectElement).value;
    this.cargarComentariosPorPublicacion(dias);
  }

  cargarPublicaciones(dias: number) {
    this.stats.getPublicacionesPorUsuario(dias).subscribe((res) => {
      const labels = res.map(item => item.label);
      const datos = res.map(item => item.data);
      this.renderChart('chartPublicaciones', 'bar', labels, datos, 'Publicaciones', '#f8e664');
    });
  }

  cargarComentarios(dias: number) {
    this.stats.getComentariosTimeline(dias).subscribe((res) => {
      const labels = res.map(item => item.label);
      const datos = res.map(item => item.data);
      this.renderChart('chartComentarios', 'line', labels, datos, 'Comentarios', '#83cbd8');
    });
  }

  cargarComentariosPorPublicacion(dias: number) {
    this.stats.getComentariosPorPublicacion(dias).subscribe((res) => {
      const labels = res.map(item => item.label);
      const datos = res.map(item => item.data);
      this.renderChart('chartComentariosPorPublicacion', 'pie', labels, datos, 'Comentarios por Post');
    });
  }

  private renderChart(canvasId: string, type: 'bar' | 'line' | 'pie', labels: string[], datos: number[], label: string, colorDefault?: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    if (this.charts[canvasId]) this.charts[canvasId].destroy();

    const esOscuro = document.body.classList.contains('dark-theme');

    const colorTexto = esOscuro ? '#ffffff' : '#000000';
    const colorBorde = esOscuro ? '#5ce1e6' : '#000000';
    let colorGrafico = colorDefault || '#000000';
    if (esOscuro) {
      if (type === 'bar') colorGrafico = '#5ce1e6';
      if (type === 'line') colorGrafico = '#b53fa7';
    }

    const coloresPastel = esOscuro 
      ? ['#b53fa7', '#5ce1e6', '#ff6b6b', '#f8e664', '#1e2627']
      : ['#ff6b6b', '#83cbd8', '#a6e3e9', '#f8e664', '#b53fa7'];

    this.charts[canvasId] = new Chart(canvas, {
      type,
      data: {
        labels,
        datasets: [{
          label,
          data: datos,
          backgroundColor: type === 'pie' ? coloresPastel : colorGrafico,
          borderColor: colorBorde,
          borderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: colorTexto, font: { weight: 'bold', family: 'monospace' } }
          }
        },
        scales: type !== 'pie' ? {
          y: { 
            ticks: { color: colorTexto, font: { weight: 'bold' } },
            grid: { color: esOscuro ? 'rgba(92, 225, 230, 0.15)' : 'rgba(0,0,0,0.15)' } // Grilla cian sutil en oscuro
          },
          x: { 
            ticks: { color: colorTexto, font: { weight: 'bold' } },
            grid: { display: false }
          }
        } : undefined
      }
    });
  }
}