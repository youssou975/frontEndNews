// src/services/axiosConfig.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // URL de base du back-end
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;  // Ajoute le token dans les en-têtes
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default api;
