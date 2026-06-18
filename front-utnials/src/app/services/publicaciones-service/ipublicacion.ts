export interface IPublicacion {
    _id: string;
    titulo: string;
    descripcion: string;
    imagenUrl?: string;

    autor: {
        _id: string;
        username: string;
        nombre: string;
        apellido: string;
        imagen: string;
    };

    likes: string[];
    likesCantidad: number;

    comentarios: string[];
    comentariosCantidad: number;

    activo: boolean;
    createdAt: string;
    updatedAt: string;
}