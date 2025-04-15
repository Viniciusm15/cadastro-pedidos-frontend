import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_BACK_END_URL;

export const fetchOrders = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${apiUrl}/api/Order`, {
      params: { pageNumber, pageSize },
      headers: { 'Content-Type': 'application/json' }
    });

    const { items, totalCount } = response.data;
    return { data: items, totalCount };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/api/Order/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${apiUrl}/api/Order`, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrder = async (id, orderData) => {
  try {
    await axios.put(`${apiUrl}/api/Order/${id}`, orderData);
  } catch (error) {
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    await axios.delete(`${apiUrl}/api/Order/${id}`);
  } catch (error) {
    throw error;
  }
};

export const generateOrderCsvReport = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/Order/generate-csv-report`, {
      responseType: 'arraybuffer',
      headers: { 'Content-Type': 'application/json' }
    });

    const blob = new Blob([response.data], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Order_Report.csv';
    link.click();
  } catch (error) {
    console.error('Erro ao gerar relatório CSV:', error);
    throw error;
  }
};
