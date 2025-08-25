import api from "./index";

// Traer lista de gastos
export const getExpenses = () => api.get("/expenses");

// Traer gastos con paginación, filtros y ordenamiento
export const getExpensesPaginated = (page = 0, limit = 10, filters = {}, sort = {}) => {
    let params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });
    
    // Add filters to params
    if (filters.category_id) {
        params.append('category_id', filters.category_id.toString());
    }
    if (filters.subcategory_id) {
        params.append('subcategory_id', filters.subcategory_id.toString());
    }
    if (filters.payment_method_id) {
        params.append('payment_method_id', filters.payment_method_id.toString());
    }
    if (filters.month) {
        params.append('month', filters.month.toString());
    }
    if (filters.year) {
        params.append('year', filters.year.toString());
    }
    
    // Add sort to params
    if (sort.field) {
        params.append('sort_field', sort.field);
        params.append('sort_direction', sort.direction || 'DESC');
    }
    
    return api.get(`/expenses/paginated?${params.toString()}`);
};

export const getAllAmountExpenses = () => api.get("/expenses/amounts")

// Traer gastos por categoría
export const getExpensesByCategory = () => api.get("/expenses/by-category");

// Crear nuevo gasto
export const createExpense = (data) => api.post("/expenses", data);

// Actualizar gasto
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);

// Eliminar gasto
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
