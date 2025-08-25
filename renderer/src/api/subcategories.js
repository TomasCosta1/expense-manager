import api from './index';

export const getSubcategories = async () => {
    try {
        const response = await api.get('/subcategories');
        return response.data;
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        throw error;
    }
};

export const getSubcategoriesByCategory = async (categoryId) => {
    try {
        const response = await api.get(`/subcategories/category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching subcategories by category:', error);
        throw error;
    }
};

export const getSubcategoryById = async (id) => {
    try {
        const response = await api.get(`/subcategories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching subcategory:', error);
        throw error;
    }
};

export const createSubcategory = async (subcategoryData) => {
    try {
        const response = await api.post('/subcategories', subcategoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating subcategory:', error);
        throw error;
    }
};

export const deleteSubcategory = async (id) => {
    try {
        const response = await api.delete(`/subcategories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        throw error;
    }
};
