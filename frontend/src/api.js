import axios from 'axios';
import { ACCESS_TOKEN } from './constants';  // Ensure ACCESS_TOKEN is correctly exported

// Axios instance setup
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,  // Correctly referencing the environment variable
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Fetch Total Notes function
const fetchTotalNotes = async () => {
    try {
        const response = await api.get('/api/notes/total/');
        return response.data;  // Return the data directly
    } catch (error) {
        console.error('Error fetching total notes:', error);
        throw error;  // Rethrow or handle accordingly
    }
};

// Fetch Total Users function
const fetchTotalUsers = async () => {
    try {
        const response = await api.get('/api/users/total/');
        return response.data;  // Return the data directly
    } catch (error) {
        console.error('Error fetching total users:', error);
        throw error;  // Rethrow or handle accordingly
    }
};

const fetchUsersAllMonths = () => {
    return api.get('/api/users/all-months/')
        .then(response => response.data) 
        .catch(error => {
            console.error('Error fetching users by month:', error);
            throw error; 
        });
};

const fetchNotesAllMonths = () => {
    return api.get('/api/notes/all-months/')
        .then(response => response.data) 
        .catch(error => {
            console.error('Error fetching notes by month:', error);
            throw error;
        });
}

export default api;  
export { fetchTotalNotes, fetchTotalUsers, fetchUsersAllMonths, fetchNotesAllMonths };