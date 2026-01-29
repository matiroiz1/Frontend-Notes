import type { Category, CategoryDTO } from '../types';
import api from './api';


export const categoryService = {
    getAll: async () => {
        const { data } = await api.get<Category[]>('/categories');
        return data;
    },

    create: async (category: CategoryDTO) => {
        const { data } = await api.post<Category>('/categories', category);
        return data;
    },

    delete: async (id: number) => {
        await api.delete(`/categories/${id}`);
    }
};