import apiClient from '../lib/axios';
import { EquipoOut, CreateEquipoIn, UpdateEquipoIn, EquipoCompeticionIn } from '../types/api';

const createEquipo = async (data: FormData): Promise<EquipoOut> => {
const response = await apiClient.post('/api/admin/equipos', data, {
headers: { 'Content-Type': 'multipart/form-data' },
});
return response.data;
};

const getEquiposByCategoria = async (categoriaId: number): Promise<EquipoOut[]> => {
const response = await apiClient.get(`/api/public/equipos?categoriaId=${categoriaId}`);
return response.data;
};

const inscribirEquipoACompeticion = async (data: EquipoCompeticionIn): Promise<void> => {
await apiClient.post('/api/admin/inscripciones-equipos', data);
};

const patchEquipo = async (id: number, data: FormData): Promise<EquipoOut> => {
const response = await apiClient.patch(`/api/admin/equipos/${id}`, data, {
headers: { 'Content-Type': 'multipart/form-data' },
});
return response.data;
};

const deleteEquipo = async (id: number): Promise<void> => {
await apiClient.delete(`/api/admin/equipos/${id}`);
};

const desinscribirEquipoDeTodo = async (equipoId: number): Promise<void> => {
await apiClient.delete(`/api/admin/inscripciones-equipos/equipo/${equipoId}`);
};

// --- ESTA ES LA FUNCIÓN QUE FALTABA ---
const getEquiposByCompeticion = async (idCompeticion: number): Promise<any[]> => {
const response = await apiClient.get(`/api/admin/inscripciones-equipos/competicion/${idCompeticion}`);
return response.data;
};

export const teamService = {
createEquipo,
getEquiposByCategoria,
inscribirEquipoACompeticion,
patchEquipo,
deleteEquipo,
desinscribirEquipoDeTodo,
getEquiposByCompeticion,
};