import { useApiService } from '@/api/core/apiService';

export const orderService = () => {
  const service = useApiService('Order', {
    headers: { 'Content-Type': 'application/json' }
  });

  const generateOrderCsvReport = async () => {
    try {
      const response = await service.api.get('/generate-csv-report', {
        responseType: 'arraybuffer'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Order_Report.csv';
      link.click();
    } catch (error) {
      throw error;
    }
  };

  return {
    ...service,
    generateOrderCsvReport
  };
};
