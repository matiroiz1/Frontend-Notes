import api from './api';
import type{ AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authService = {
    login: async (creds: LoginRequest) => {
        const { data } = await api.post<AuthResponse>('/auth/login', creds);
        // Guardamos automáticamente en localStorage al tener éxito
        if (data.token) {
            localStorage.setItem('jwt_token', data.token);
            localStorage.setItem('app_user', data.username);
        }
        return data;
    },

    register: async (creds: RegisterRequest) => {
        const { data } = await api.post<AuthResponse>('/auth/register', creds);
        if (data.token) {
            localStorage.setItem('jwt_token', data.token);
            localStorage.setItem('app_user', data.username);
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('app_user');
    }
};