import { createApiClient } from '@/api/core/apiClient';

const api = createApiClient('OrderItem');

export const fetchOrderItemsByOrderId = async (orderId) => {
  try {
    const response = await api.get(`/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
