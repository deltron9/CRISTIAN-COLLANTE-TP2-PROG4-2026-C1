export interface IComentario {
  _id: string;
  texto: string;
  autor: {
    _id: string;
    username: string;
    imagen?: string;
    nombre?: string;
    apellido?: string;
  };
  publicacion: string;
  modificado: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IComentarioListaResponse {
  comentarios: IComentario[];
  total: number;
}
