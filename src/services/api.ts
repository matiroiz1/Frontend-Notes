import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// INTERCEPTOR DE REQUEST
// Antes de enviar la petición, le inyectamos el token si existe
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// INTERCEPTOR DE RESPONSE (Opcional pero recomendado)
// Si el backend nos dice "Token inválido" (403), cerramos sesión automáticamente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('app_user');
            window.location.href = '/login'; // Redirigir a login
        }
        return Promise.reject(error);
    }
);

export default api;