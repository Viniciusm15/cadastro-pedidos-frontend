import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_BACK_END_URL;

export const fetchOrderItemsByOrderId = async (orderId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/OrderItem/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
