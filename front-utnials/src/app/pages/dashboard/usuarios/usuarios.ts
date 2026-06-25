import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { formUsuario } from '../../../shared/form-registro';
import { UsuariosService } from '../../../services/usuarios-service/usuarios-service';
import { AlertService } from '../../../services/alert-service';

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {
  user = inject(UsuariosService);
  alert = inject(AlertService);

  listaUsuarios = signal<any[]>([]);
  ventanaActiva = signal<'listado' | 'registro'>('listado');
  
  formRegistro = formUsuario();

  ngOnInit(): void {
    if (!this.formRegistro.contains('perfil')) {
      this.formRegistro.addControl('perfil', new FormControl('user', [Validators.required]));
    }
    this.cargarUsuarios();
  }

  cambiarVentana(ventana: 'listado' | 'registro') {
    this.ventanaActiva.set(ventana);
  }

  cargarUsuarios() {
    this.user.listarTodos().subscribe(
      (data) => {
        this.listaUsuarios.set(data);
      },
      (err) => {
        console.error('Error al traer usuarios: ', err);
      }
    );
  }

  crearUsuario() {
    if (this.formRegistro.valid) {
      const nuevoUsuario = this.formRegistro.value;
      
      this.user.crear(nuevoUsuario).subscribe(
        async () => {
          await this.alert.msjSuccess(`Usuario @${nuevoUsuario.username} creado con éxito`);
          
          this.formRegistro.reset({
            nombre: '', apellido: '', email: '', username: '', 
            password: '', repetirPassword: '', fechaNacimiento: '', 
            descripcion: '', perfil: 'user'
          });
          
          this.cargarUsuarios();
          this.ventanaActiva.set('listado');
        },
        async (err) => {
          await this.alert.msjError(err.error?.message);
        }
      );
    } else {
      this.formRegistro.markAllAsTouched();
    }
  }

  toggleEstado(id: string, habilitar: boolean) {
    const peticion$ = habilitar 
      ? this.user.habilitarUsuario(id) 
      : this.user.deshabilitarUsuario(id);

    peticion$.subscribe(
      async () => {
        this.listaUsuarios.update(lista => 
          lista.map(u => u._id === id ? { ...u, activo: habilitar } : u)
        );
        await this.alert.msjSuccess(habilitar ? 'Cuenta reactivada' : 'Cuenta deshabilitada');
      },
      async (err) => {
        await this.alert.msjError(err.error?.message);
      }
    );
  }
}