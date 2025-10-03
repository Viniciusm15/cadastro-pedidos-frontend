import { clientService } from '@/api/clientService';
import { fetchOrderItemsByOrderId } from '@/api/orderItemService';
import { orderService } from '@/api/orderService';
import { fetchProducts } from '@/api/productService';
import { orderSchema } from '@/schemas/orderSchema';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { usePagination } from '@/hooks/usePaginationManagement';
import dayjs from 'dayjs';
import { OrderStatus, getStatusByDescription } from '@/enums/OrderStatus';

const INITIAL_FORM_STATE = {
  clientId: null,
  orderDate: dayjs(),
  status: '',
  orderItems: [],
  totalValue: 0
};

export function useOrderManagement() {
  const { fetchAll, create, update, remove, generateOrderCsvReport } = orderService();

  const [orders, setOrders] = useState({ data: [], totalCount: 0 });
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const pagination = usePagination();

  const resetForm = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
    setFormErrors({});
    setSelectedOrder(null);
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const clientMap = useMemo(() => {
    return clients.reduce((acc, client) => {
      acc[client.clientId] = client.name;
      return acc;
    }, {});
  }, [clients]);

  const getClientName = useCallback((clientId) => clientMap[clientId] || 'Unknown Client', [clientMap]);

  const loadData = useCallback(async () => {
    try {
      const [clientsRes, productsRes, ordersRes] = await Promise.all([
        clientService.fetchAll(),
        fetchProducts(),
        fetchAll(
          pagination.apiParams.pageNumber,
          pagination.apiParams.pageSize
        )
      ]);

      setClients(clientsRes?.data || []);
      setProducts(productsRes?.data || []);
      setOrders({
        data: ordersRes?.data || [],
        totalCount: ordersRes?.totalCount || 0
      });

      const map = (productsRes?.data || []).reduce((acc, product) => {
        acc[product.productId] = product;
        return acc;
      }, {});
      setProductMap(map);
    } catch (error) {
      showSnackbar('Error loading data', 'error');
    }
  }, [pagination.apiParams.pageNumber, pagination.apiParams.pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = () => {
    loadData();
  };

  useEffect(() => {
    if (selectedOrder) {
      setFormState({
        ...selectedOrder,
        orderDate: dayjs(selectedOrder.orderDate),
        status: selectedOrder.status || OrderStatus.PENDING.value,
        orderItems: selectedOrder.orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitaryPrice: item.unitaryPrice,
          id: item.orderItemId
        })) || []
      });
    }
  }, [selectedOrder]);

  const enhancedOrders = useMemo(() => {
    return orders.data.map((order) => ({
      ...order,
      clientName: getClientName(order.clientId),
      statusDescription: getStatusByDescription(order.status)
    }));
  }, [orders.data, getClientName]);

  const handleOpenModal = useCallback(
    (type, row = null) => {
      setFormErrors({});

      if (type === 'create') {
        resetForm();
      } else if (row) {
        setFormState({
          clientId: row.clientId,
          orderDate: dayjs(row.orderDate),
          status: getStatusByDescription(row.status),
          orderItems:
            row.orderItems?.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitaryPrice: item.unitaryPrice,
              id: item.orderItemId || item.id
            })) || [],
          totalValue: row.totalValue || 0
        });
      }

      setModalType(type);
      setIsModalOpen(true);
    },
    [resetForm]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRowId(null);
    resetForm();
  }, [resetForm]);

  const handleView = useCallback(async () => {
    try {
      const order = orders.data.find(({ orderId }) => orderId === selectedRowId);
      if (order) {
        const orderItemsRes = await fetchOrderItemsByOrderId(order.orderId);
        const enhancedOrder = {
          ...order,
          clientName: getClientName(order.clientId),
          statusDescription: getStatusByDescription(order.status),
          orderItems: orderItemsRes.map(item => ({
            ...item,
            subtotal: item.quantity * item.unitaryPrice
          }))
        };
        setSelectedOrder(enhancedOrder);
        handleOpenModal('view', enhancedOrder);
      }
    } catch (error) {
      showSnackbar('Error loading order details', 'error');
    }
  }, [orders.data, selectedRowId, getClientName, handleOpenModal]);

  const handleCreate = useCallback(() => {
    resetForm();
    handleOpenModal('create');
  }, [handleOpenModal, resetForm]);

  const handleEdit = useCallback(async () => {
    try {
      const order = orders.data.find(({ orderId }) => orderId === selectedRowId);
      if (order) {
        const orderItemsRes = await fetchOrderItemsByOrderId(order.orderId);
        const orderItemsFormatted = orderItemsRes
          .map((item) =>
            productMap[item.productId]
              ? {
                ...item,
                productName: productMap[item.productId].name,
                subtotal: item.quantity * item.unitaryPrice
              }
              : null
          )
          .filter(Boolean);

        const enhancedOrder = {
          ...order,
          clientName: getClientName(order.clientId),
          statusDescription: getStatusByDescription(order.status),
          orderItems: orderItemsFormatted
        };

        setSelectedOrder(enhancedOrder);
        setFormState({
          ...enhancedOrder,
          status: getStatusByDescription(order.status),
          orderItems: orderItemsFormatted.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitaryPrice: item.unitaryPrice,
            id: item.orderItemId
          }))
        });

        handleOpenModal('edit', enhancedOrder);
      }
    } catch (error) {
      showSnackbar('Error loading order for edit', 'error');
    }
  }, [orders.data, selectedRowId, getClientName, productMap, handleOpenModal]);

  const handleDelete = useCallback(async () => {
    if (!selectedRowId) return;

    try {
      await remove(selectedRowId);
      showSnackbar('Order deleted successfully');
      refreshData();
      setSelectedRowId(null);
    } catch (error) {
      showSnackbar('Error deleting order', 'error');
    }
  }, [selectedRowId, remove]);

  const handleInputChange = ({ target: { name, value } }) => {
    if (name === 'status') {
      setFormState(prev => ({ ...prev, [name]: Number(value) }));
    }
    if (name === 'orderItems') {
      const selectedProductIds = Array.isArray(value) ? value : [value];
      const selectedProducts = selectedProductIds
        .map((productId) => productMap[productId])
        .filter(Boolean)
        .map((product) => ({
          productId: product.productId,
          quantity: 1,
          unitaryPrice: product.price,
          subtotal: product.price
        }));

      setFormState((prev) => {
        const updatedOrderItems = [...prev.orderItems];
        selectedProducts.forEach((newProduct) => {
          const existingProduct = updatedOrderItems.find((item) => item.productId === newProduct.productId);

          if (!existingProduct) {
            updatedOrderItems.push(newProduct);
          }
        });
        return { ...prev, orderItems: updatedOrderItems };
      });
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveItem = useCallback((productId) => {
    setFormState((prev) => ({
      ...prev,
      orderItems: prev.orderItems.filter((item) => item.productId !== productId)
    }));
  }, []);

  const handleQuantityChange = useCallback(
    (productId, quantity) => {
      const parsedQuantity = parseInt(quantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        handleRemoveItem(productId);
        return;
      }

      setFormState((prev) => ({
        ...prev,
        orderItems: prev.orderItems.map((item) =>
          item.productId === productId
            ? {
              ...item,
              quantity: parsedQuantity,
              subtotal: parsedQuantity * item.unitaryPrice
            }
            : item
        )
      }));
    },
    [handleRemoveItem]
  );

  const handleDateChange = (date) => {
    const newDate = dayjs(date);
    setFormState((prev) => ({
      ...prev,
      orderDate: newDate.isValid() ? newDate : dayjs()
    }));
  };

  const totalValue = useMemo(() => {
    if (!Array.isArray(formState.orderItems)) return 0;
    return formState.orderItems.reduce((sum, item) => sum + item.quantity * item.unitaryPrice, 0);
  }, [formState.orderItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      ...formState,
      orderDate: dayjs(formState.orderDate).format('YYYY-MM-DD'),
      totalValue,
      status: formState.status,
      clientId: formState.clientId,
      orderItems:
        formState.orderItems?.map((item) => ({
          id: item.id,
          productId: item.productId,
          orderId: modalType === 'edit' ? parseInt(selectedRowId, 10) : 0,
          quantity: item.quantity,
          unitaryPrice: item.unitaryPrice,
          subtotal: item.subtotal
        })) || []
    };

    try {
      await orderSchema.validate(formState, { abortEarly: false });
      setFormErrors({});

      if (modalType === 'create') {
        await create(orderData);
        showSnackbar('Order created successfully');
      } else if (modalType === 'edit') {
        await update(selectedRowId, orderData);
        showSnackbar('Order updated successfully');
      }

      refreshData();
      handleCloseModal();
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = {};
        err.inner.forEach((validationError) => {
          errors[validationError.path] = validationError.message;
        });
        setFormErrors(errors);
      } else {
        showSnackbar('Error saving order', 'error');
      }
    }
  };

  return {
    orders: {
      data: enhancedOrders,
      totalCount: orders.totalCount
    },
    clients,
    products,
    productMap,
    formState,
    isModalOpen,
    modalType,
    selectedOrder,
    selectedRowId,
    setSelectedRowId,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleRemoveItem,
    handleCloseModal,
    handleInputChange,
    handleQuantityChange,
    handleDateChange,
    handleSubmit,
    formErrors,
    refreshData,
    snackbar,
    closeSnackbar,
    pagination,
    generateOrderCsvReport
  };
}
