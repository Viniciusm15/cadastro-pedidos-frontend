import { useApiService } from '@/api/core/apiService';

export const dashboardService = () => {
    const service = useApiService('dashboard', {
        headers: { 'Content-Type': 'application/json' }
    });

    const getMetrics = async () => {
        try {
            const response = await service.api.get('/metrics');
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const getWeeklySales = async () => {
        try {
            const response = await service.api.get('/weekly-sales');
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const getLowStockProducts = async (pageNumber = 1, pageSize = 10) => {
        try {
            const response = await service.api.get('/low-stock-products', {
                params: {
                    pageNumber: pageNumber,
                    pageSize: pageSize
                }
            });
            const { items, totalCount } = response.data;
            return { data: items, totalCount };
        } catch (error) {
            throw error;
        }
    };

    const getPendingOrders = async (pageNumber = 1, pageSize = 10) => {
        try {
            const response = await service.api.get('/pending-orders', {
                params: {
                    pageNumber: pageNumber,
                    pageSize: pageSize
                }
            });
            const { items, totalCount } = response.data;
            return { data: items, totalCount };
        } catch (error) {
            throw error;
        }
    };

    const getClientsData = async () => {
        try {
            const response = await service.api.get('/clients-data');
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const restockProduct = async (productId, restockQuantity) => {
        try {
            const response = await service.api.post(`/restock-product/${productId}`, restockQuantity);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    return {
        getMetrics,
        getWeeklySales,
        getLowStockProducts,
        getPendingOrders,
        getClientsData,
        restockProduct
    };
};
