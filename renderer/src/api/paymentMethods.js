import api from './index';

export const getPaymentMethods = async () => {
    try {
        const response = await api.get('/payment-methods');
        return response.data;
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        throw error;
    }
};