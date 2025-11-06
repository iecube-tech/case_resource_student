import axios from 'axios'

const anyHttp = axios.create({
  baseURL: '',
  timeout: 60000,
});

anyHttp.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

anyHttp.interceptors.response.use(
  (res) => {
    return res; 
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default anyHttp;