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