import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  console.error("Variável de ambiente REACT_APP_API_URL não definida. Verifique seu arquivo .env.");
  throw new Error("REACT_APP_API_URL is not defined");
}

// Cria uma instância do Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error("Erro na resposta da API:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("Nenhuma resposta recebida da API:", error.request);
    } else {
      console.error("Erro ao configurar requisição:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;