// Replace with your actual production URL
const PROD_API_URL = 'https://backend.travellersdeal.com/api';
// User requested to connect to production backend even in DEV mode
const DEV_API_URL = 'https://backend.travellersdeal.com/api';

export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;
