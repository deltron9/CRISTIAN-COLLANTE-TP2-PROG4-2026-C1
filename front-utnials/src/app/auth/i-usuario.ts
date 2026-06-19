export interface IUsuario {
    _id: string;
    username: string;
    email: string;
    nombre: string;
    apellido: string;
    imagen?: string;
    fechaNacimiento: string;
    descripcion?: string;
    perfil: string
}

