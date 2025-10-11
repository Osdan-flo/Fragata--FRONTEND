// --- DTOs de Autenticación ---
export interface LoginDto {
email: string;
password: string;
}

export interface TokenDto {
token: string;
}

// DTO de salida para Categoría
export interface CategoriaOut {
id: number;
nombre: string;
descripcion?: string;
asciendeA?: { id: number; nombre: string; };
desciendeDesde?: { id: number; nombre: string; };
}

// DTO de entrada para Categoría
export interface CategoriaIn {
nombre: string;
descripcion?: string;
asciendeAId?: number;
desciendeDesdeId?: number;
}

// --- DTOs de Torneo y Competición ---
export interface TorneoIn {
nombre: string;
anio: number;
fechaInicio: string;
fechaFin: string;
idCategoria: number;
}

// --- NUEVO TIPO ---
// Este es el tipo que el frontend usa para el formulario del modal
export interface TorneoCompeticionIn extends TorneoIn {
idCategoria: number;
}

export interface CompeticionIn {
idTorneo: number;
idCategoria: number;
}

export interface CompeticionSimpleOut {
idCompeticion: number;
categoriaNombre: string;
}

export interface TorneoOut {
id: number;
nombre: string;
anio: number;
fechaInicio: string; // <-- La fecha está aquí
fechaFin: string;   // <-- La fecha está aquí
competiciones: { idCompeticion: number; categoriaNombre: string; }[];
}

export interface CompeticionOut {
idCompeticion: number;
torneo: {
idTorneo: number;
nombre: string;
anio: number;
fechaInicio: string; // <-- Y también aquí
fechaFin: string;   // <-- Y también aquí
};
categoria: { idCategoria: number; nombre: string; };
}