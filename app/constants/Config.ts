// Replace with your actual production URL
const PROD_API_URL = 'https://backend.travellersdeal.com/api';
const DEV_API_URL = 'http://10.0.2.2:5000/api';

export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;
