import apiClient from '../lib/axios';
import { CategoriaOut, CategoriaIn } from '../types/api'; // Crearemos este archivo

const getCategorias = async (): Promise<CategoriaOut[]> => {
const response = await apiClient.get('/api/public/categorias');
return response.data;
};

const createCategoria = async (data: CategoriaIn): Promise<CategoriaOut> => {
const response = await apiClient.post('/api/admin/categorias', data);
return response.data;
};

const updateCategoria = async (id: number, data: CategoriaIn): Promise<CategoriaOut> => {
const response = await apiClient.put(`/api/admin/categorias/${id}`, data);
return response.data;
};

const deleteCategoria = async (id: number): Promise<void> => {
await apiClient.delete(`/api/admin/categorias/${id}`);
};

const patchCategoria = async (id: number, data: Partial<CategoriaIn>): Promise<CategoriaOut> => {
const response = await apiClient.patch(`/api/admin/categorias/${id}`, data);
return response.data;
};

export const categoryService = {
getCategorias,
createCategoria,
updateCategoria,
deleteCategoria,
patchCategoria,
};