import axios from 'axios';

// process.env.VITE_APP_BACKEND_URLからimport.meta.env.VITE_APP_BACKEND_URLへ変更
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL
});

export default instance;