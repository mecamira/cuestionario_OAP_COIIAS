// Tipos que reflejan fielmente el esquema de ../../data/cuestionario.json.
// Fuente de verdad: el JSON en si (validado por scripts/validate_cuestionario.py),
// estos tipos solo describen su forma para el compilador.

export type ValorOpcion = number | null;

export interface Opcion {
  label: string;
  valor: ValorOpcion;
  no_aplica?: boolean;
}

export interface Pregunta {
  id: string;
  texto: string;
  opciones: Opcion[];
  /** id de respuesta ("0" | "1" | "2") -> ids de video recomendados */
  recomendaciones?: Record<string, string[]>;
}

export interface RecomendacionSector {
  sectores: string[];
  ids: string[];
}

export interface Dimension {
  id: string;
  nombre: string;
  descripcion: string;
  areas_json: string[];
  max_puntos: number;
  nota_recomendador?: string;
  recomendacion_sector?: RecomendacionSector;
  preguntas: Pregunta[];
}

export interface CampoPerfilOpcion {
  value: string;
  label: string;
}

export interface CampoPerfil {
  id: string;
  label: string;
  tipo: "texto" | "email" | "tel" | "select";
  obligatorio: boolean;
  opciones?: CampoPerfilOpcion[];
  nota?: string;
}

export interface TierGlobal {
  id: string;
  label: string;
  min_pct: number;
  max_pct: number;
  color: string;
  titular: string;
  descripcion: string;
}

export interface UmbralNivelDimension {
  max_pct: number;
  nivel_recomendado: "basico" | "intermedio" | "avanzado";
}

export interface Cuestionario {
  meta: {
    titulo: string;
    subtitulo: string;
    descripcion: string;
    duracion_estimada_min: number;
    version: string;
    fecha: string;
    notas_version: string;
  };
  reglas_recomendador: Record<string, unknown>;
  perfil_empresa: {
    descripcion: string;
    campos: CampoPerfil[];
  };
  dimensiones: Dimension[];
  areas_no_puntuadas: Record<string, string>;
  resultado: {
    descripcion: string;
    umbral_nivel_dimension: UmbralNivelDimension[];
    tiers_globales: TierGlobal[];
  };
  plataforma_contenidos: {
    nombre: string;
    url: string;
    acceso: string;
    nota: string;
  };
  cta_resultado: {
    texto_recomendaciones: string;
    boton_plataforma: string;
    texto_informe: string;
    boton_informe: string;
  };
}
