import { useState, useEffect } from 'react';
import { dashboardService } from '@/api/dashboardService';
import { usePagination } from '@/hooks/usePaginationManagement';

export const useDashboardManagement = () => {
  const [metrics, setMetrics] = useState(null);
  const [salesData, setSalesData] = useState({ data: [], labels: [] });
  const [lowStockProducts, setLowStockProducts] = useState({ data: [], totalCount: 0 });
  const [pendingOrders, setPendingOrders] = useState({ data: [], totalCount: 0 });
  const [customersData, setCustomersData] = useState({});

  const [restockModal, setRestockModal] = useState({
    open: false,
    productId: null,
    productName: '',
    currentStock: 0,
    quantity: 10
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const lowStockPagination = usePagination();
  const pendingOrdersPagination = usePagination();

  const fetchData = async ({
    lowStockParams,
    pendingOrdersParams
  }) => {
    try {
      const dashboardApi = dashboardService();

      const [metricsData, salesData, lowStockData, ordersData, customersData] = await Promise.all([
        dashboardApi.getMetrics(),
        dashboardApi.getWeeklySales(),
        dashboardApi.getLowStockProducts(lowStockParams),
        dashboardApi.getPendingOrders(pendingOrdersParams),
        dashboardApi.getCustomersData()
      ]);

      setMetrics(metricsData);
      setSalesData({
        data: salesData.map((item) => item.totalSales),
        labels: salesData.map((item) => item.day)
      });
      setLowStockProducts(lowStockData);
      setPendingOrders(ordersData);
      setCustomersData(customersData);
    } catch (err) {
      showSnackbar('Failed to load dashboard data', 'error');
    }
  };

  useEffect(() => {
    fetchData({
      lowStockParams: lowStockPagination.apiParams,
      pendingOrdersParams: pendingOrdersPagination.apiParams
    });
  }, [
    lowStockPagination.pagination.page,
    lowStockPagination.pagination.rowsPerPage,
    pendingOrdersPagination.pagination.page,
    pendingOrdersPagination.pagination.rowsPerPage
  ]);


  const refreshData = () => {
    fetchData({
      lowStockParams: lowStockPagination.apiParams,
      pendingOrdersParams: pendingOrdersPagination.apiParams
    });
  };

  const openRestockModal = (productId, productName, currentStock) => {
    setRestockModal({
      open: true,
      productId,
      productName,
      currentStock,
      quantity: 10
    });
  };

  const closeRestockModal = () => {
    setRestockModal({
      ...restockModal,
      open: false
    });
  };

  const handleRestockSubmit = async () => {
    if (!restockModal.productId || restockModal.quantity <= 0) return;

    try {
      const dashboardApi = dashboardService();
      await dashboardApi.restockProduct(
        restockModal.productId,
        restockModal.quantity
      );

      showSnackbar(`Successfully restocked ${restockModal.productName}`, 'success');
      refreshData();
      closeRestockModal();
    } catch (err) {
      showSnackbar(`Failed to restock ${restockModal.productName}`, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return {
    metrics,
    salesData,
    lowStockProducts,
    pendingOrders,
    customersData,
    refreshData,
    restockModal,
    openRestockModal,
    closeRestockModal,
    handleRestockSubmit,
    handleQuantityChange: (quantity) => {
      setRestockModal({
        ...restockModal,
        quantity
      });
    },
    snackbar,
    closeSnackbar,
    lowStockPagination,
    pendingOrdersPagination
  };
};
