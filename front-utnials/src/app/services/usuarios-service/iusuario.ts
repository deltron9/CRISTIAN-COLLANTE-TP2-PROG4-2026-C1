export interface IUsuario {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  fechaNacimiento: string;
  descripcion: string;
  imagen: string;
  perfil: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}