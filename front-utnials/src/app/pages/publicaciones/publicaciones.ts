import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PublicacionesService } from '../../services/publicaciones-service/publicaciones-service';
import { AuthService } from '../../auth/auth-service';
import { AlertService } from '../../services/alert-service';
import { PublicacionesCard } from '../../componentes/publicaciones-card/publicaciones-card';

@Component({
  selector: 'app-publicaciones',
  imports: [CommonModule, ReactiveFormsModule, PublicacionesCard],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css'
})
export class Publicaciones implements OnInit {
  publis = inject(PublicacionesService);
  auth = inject(AuthService);
  alert = inject(AlertService);

  filtroActual = signal<'createdAt' | 'likesCantidad'>('createdAt');
  fotoSeleccionada = signal<File | null>(null);
  imagenPrevisualizada = signal<string>('');

  formPublicacion = new FormGroup({
    titulo: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(80)],
      nonNullable: true
    }),
    descripcion: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(150)],
      nonNullable: true
    })
  });

  usuarioLogueado = this.auth.usuarioActual;
  listaPublicaciones = this.publis.publicaciones;

  efectoFiltro = effect(() => {this.cargarPublicaciones();});

  ngOnInit(): void {
    
  }

  cargarPublicaciones() {
    this.publis.listar(10, 0, this.filtroActual()).subscribe({});
  }

  seleccionarFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fotoSeleccionada.set(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPrevisualizada.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  borrarFoto() {
    this.fotoSeleccionada.set(null);
    this.imagenPrevisualizada.set('');
  }

  publicar() {
    if (this.formPublicacion.invalid) {
      this.formPublicacion.markAllAsTouched();
      return;
    }

    const titulo = this.formPublicacion.controls.titulo.value;
    const descripcion = this.formPublicacion.controls.descripcion.value;

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    
    if (this.fotoSeleccionada()) {
      formData.append('file', this.fotoSeleccionada()!);
    }

    const copiaPrevisualizacion = this.imagenPrevisualizada();

    this.publis.crear(formData, copiaPrevisualizacion).subscribe({
      next: () => {
        this.formPublicacion.reset();
        this.borrarFoto();
      },
      error: (err: any) => this.alert.msjError(err.error?.message || 'Error al publicar.')
    });
  }
}