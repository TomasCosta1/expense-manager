import api from "./index";

// Traer lista de gastos
export const getExpenses = () => api.get("/expenses");

export const getAllAmountExpenses = () => api.get("/expenses/amounts")

// Crear nuevo gasto
export const createExpense = (data) => api.post("/expenses", data);

// Eliminar gasto
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
