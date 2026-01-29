import type { Note, NoteDTO } from '../types';
import api from './api';


export const noteService = {
    // Phase 1: Listados
    getActive: async () => {
        const { data } = await api.get<Note[]>('/notes');
        return data;
    },

    getArchived: async () => {
        const { data } = await api.get<Note[]>('/notes/archived');
        return data;
    },

    // Phase 2: Filtro (Endpoint específico)
    filterByCategory: async (categoryId: number) => {
        const { data } = await api.get<Note[]>(`/notes/filter?categoryId=${categoryId}`);
        return data;
    },

    // CRUD
    create: async (note: NoteDTO) => {
        const { data } = await api.post<Note>('/notes', note);
        return data;
    },

    update: async (id: number, note: NoteDTO) => {
        // Aquí está la magia: enviamos título, contenido Y la lista de IDs de categorías
        const { data } = await api.put<Note>(`/notes/${id}`, note);
        return data;
    },

    delete: async (id: number) => {
        await api.delete(`/notes/${id}`);
    },

    toggleArchive: async (id: number) => {
        await api.patch(`/notes/${id}/archive`);
    }
};