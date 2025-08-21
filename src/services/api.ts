import axios from 'axios';

export const api = axios.create({
    baseURL: 'HTTP://localhost:3333',
});