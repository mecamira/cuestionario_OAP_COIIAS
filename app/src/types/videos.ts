// Tipos para ../../data/videos.json (catalogo de material didactico).

export type Categoria = "pildora" | "webinar" | "curso" | "charla";
export type Nivel = "basico" | "intermedio" | "avanzado";
export type Vigencia = "vigente" | "sustituido";

export interface Video {
  id: string;
  titulo: string;
  url: string;
  duracion_seg: number;
  fecha_publicacion: string;
  categoria: Categoria;
  serie: string;
  resumen: string | null;
  temas: string[];
  areas: string[];
  nivel: Nivel | null;
  publico_objetivo: string | null;
  resumen_generado: boolean;
  sustituye_a: string[];
  vigencia: Vigencia;
}

export interface CatalogoVideos {
  descripcion: string;
  areas_posibles: string[];
  niveles_posibles: Nivel[];
  nota_vigencia: string;
  total_videos: number;
  videos: Video[];
}
