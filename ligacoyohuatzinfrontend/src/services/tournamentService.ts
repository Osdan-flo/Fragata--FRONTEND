import apiClient from '../lib/axios';
import { TorneoOut, TorneoIn, CompeticionOut, CompeticionIn, CategoriaOut } from '../types/api';

// --- Métodos de Admin ---
const createTournamentAndCompetition = async (data: TorneoCompeticionIn): Promise<CompeticionOut> => {
const response = await apiClient.post('/api/admin/competiciones/crear-completo', data);
return response.data;
};

// --- Métodos Públicos ---
const getAnios = async (): Promise<number[]> => {
const response = await apiClient.get('/api/public/torneos/anios');
return response.data;
};

const getTorneosByAnio = async (anio: number): Promise<TorneoOut[]> => {
const response = await apiClient.get(`/api/public/torneos?anio=${anio}`);
return response.data;
};

// Asumimos que tienes un endpoint para obtener competiciones por torneo
const getCompeticionesByTorneo = async (torneoId: number): Promise<CompeticionOut[]> => {
const response = await apiClient.get(`/api/public/competiciones?torneoId=${torneoId}`);
return response.data;
};

const getCompeticionesByAnioAndCategoria = async (anio: number, categoriaId: number): Promise<CompeticionOut[]> => {
const response = await apiClient.get(`/api/public/competiciones?anio=${anio}&categoriaId=${categoriaId}`);
return response.data;
};

const patchTorneo = async (id: number, data: Partial<TorneoIn>): Promise<TorneoOut> => {
const response = await apiClient.patch(`/api/admin/torneos/${id}`, data);
return response.data;
};

const deleteCompeticion = async (id: number): Promise<void> => {
await apiClient.delete(`/api/admin/competiciones/${id}`);
};

const patchCompeticion = async (id: number, data: { idCategoria: number }): Promise<CompeticionOut> => {
const response = await apiClient.patch(`/api/admin/competiciones/${id}`, data);
return response.data;
};

export const tournamentService = {
createTournamentAndCompetition,
getAnios,
getTorneosByAnio,
getCompeticionesByTorneo,
getCompeticionesByAnioAndCategoria,
patchTorneo,
deleteCompeticion,
patchCompeticion,
};
