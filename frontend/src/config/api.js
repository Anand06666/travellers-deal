// API Configuration
// Remove trailing slash if present
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');

export default {
    API_URL
};
