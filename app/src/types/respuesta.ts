// Forma del documento que se guarda en la coleccion Firestore "respuestas".
// Un documento por envio del cuestionario publico. Ver firestore.rules para
// las reglas de acceso y validacion de creacion.

export interface PerfilEmpresa {
  nombre_contacto: string;
  empresa: string;
  email: string;
  telefono: string | null;
  codigo_postal: string;
  tamano_empresa: string;
  sector: string;
  rol_contacto: string | null;
}

/** valor numerico de la opcion elegida, o "no_aplica" si se marco esa opcion */
export type RespuestaValor = number | "no_aplica";

export interface DimensionResultado {
  id: string;
  score: number;
  max: number;
  pct: number;
}

export interface ResultadoCalculado {
  version_cuestionario: string;
  pct_global: number;
  tier: string;
  dimensiones: DimensionResultado[];
}

export interface InformeEstado {
  generado: boolean;
  fecha_generado: unknown; // Firestore Timestamp (serverTimestamp() al escribir) | null
  enviado: boolean;
  fecha_envio: unknown;
  empresa_respondio: boolean;
  fecha_respuesta_empresa: unknown;
  notas: string;
}

export interface RespuestaMeta {
  creado_en: unknown; // Firestore Timestamp (serverTimestamp() al escribir)
  actualizado_en: unknown;
  origen: string;
}

export interface RespuestaDoc {
  perfil: PerfilEmpresa;
  respuestas: Record<string, RespuestaValor>;
  resultado: ResultadoCalculado;
  informe: InformeEstado;
  meta: RespuestaMeta;
}

/** RespuestaDoc con el id del documento, tal como se usa en el dashboard. */
export interface Respuesta extends RespuestaDoc {
  id: string;
}

export function informeEstadoInicial(): InformeEstado {
  return {
    generado: false,
    fecha_generado: null,
    enviado: false,
    fecha_envio: null,
    empresa_respondio: false,
    fecha_respuesta_empresa: null,
    notas: "",
  };
}
