import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api", // Cambiá por tu back
});

export default api;