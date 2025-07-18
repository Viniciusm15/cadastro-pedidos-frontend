import { clientService } from '@/api/clientService';
import { fetchOrderItemsByOrderId } from '@/api/orderItemService';
import { orderService } from '@/api/orderService';
import { fetchProducts } from '@/api/productService';
import { orderSchema } from '@/schemas/orderSchema';
import { useEffect, useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import { OrderStatus, getStatusByDescription, getStatusByValue } from '@/enums/OrderStatus';

export default function useOrderManagement() {
  const { fetchAll, create, update, remove, generateOrderCsvReport } = orderService();

  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formState, setFormState] = useState({
    clientId: null,
    orderDate: dayjs(),
    status: OrderStatus.PENDING.description,
    orderItems: [],
    totalValue: 0
  });
  const [formErrors, setFormErrors] = useState({});

  const resetForm = useCallback(() => {
    setFormState({
      clientId: null,
      orderDate: dayjs(),
      status: OrderStatus.PENDING.description,
      orderItems: [],
      totalValue: 0
    });
    setFormErrors({});
    setSelectedOrder(null);
  }, []);

  const clientMap = useMemo(() => {
    return clients.reduce((acc, client) => {
      acc[client.clientId] = client.name;
      return acc;
    }, {});
  }, [clients]);

  const getClientName = useCallback((clientId) => clientMap[clientId] || 'Unknown Client', [clientMap]);

  useEffect(() => {
    Promise.all([clientService.fetchAll(), fetchProducts(), fetchAll()]).then(
      ([clientsRes, productsRes, ordersRes]) => {
        setClients(clientsRes?.data || []);
        setProducts(productsRes?.data || []);
        setOrders(ordersRes?.data || []);
        const map = (productsRes?.data || []).reduce((acc, product) => {
          acc[product.productId] = product;
          return acc;
        }, {});
        setProductMap(map);
      }
    );
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setFormState({
        ...selectedOrder,
        status: getStatusByDescription(selectedOrder.status),
        orderItems:
          selectedOrder.orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitaryPrice: item.unitaryPrice,
            id: item.orderItemId
          })) || []
      });
    }
  }, [selectedOrder]);

  const enhancedOrders = useMemo(() => {
    if (!clients.length) return orders;
    return orders.map((order) => ({
      ...order,
      clientName: getClientName(order.clientId),
      statusDescription: getStatusByDescription(order.status)
    }));
  }, [orders, clients, getClientName]);

  const openModal = useCallback(
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

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRowId(null);
    resetForm();
  }, [resetForm]);

  const handleView = useCallback(async () => {
    const order = orders.find(({ orderId }) => orderId === selectedRowId);
    if (order) {
      const orderItemsRes = await fetchOrderItemsByOrderId(order.orderId);
      const enhancedOrder = {
        ...order,
        clientName: getClientName(order.clientId),
        statusDescription: getStatusByDescription(order.status),
        orderItems: orderItemsRes
      };
      setSelectedOrder(enhancedOrder);
      openModal('view', enhancedOrder);
    }
  }, [orders, selectedRowId, getClientName]);

  const handleCreate = useCallback(() => {
    resetForm();
    openModal('create');
  }, [openModal, resetForm]);

  const handleEdit = useCallback(async () => {
    const order = orders.find(({ orderId }) => orderId === selectedRowId);
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

      openModal('edit', enhancedOrder);
    }
  }, [orders, selectedRowId, getClientName, productMap]);

  const handleDelete = useCallback(async () => {
    if (!selectedRowId) return;
    await remove(selectedRowId);
    setOrders((prev) => prev.filter(({ orderId }) => orderId !== selectedRowId));
    setSelectedRowId(null);
  }, [selectedRowId]);

  const handleInputChange = ({ target: { name, value } }) => {
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

  const handleDateChange = (date) =>
    setFormState((prev) => ({
      ...prev,
      orderDate: dayjs(date).isValid() ? dayjs(date) : prev.orderDate
    }));

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
      status: getStatusByValue(formState.status),
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
      } else if (modalType === 'edit') {
        await update(selectedRowId, orderData);
      }

      closeModal();
      const { data } = await fetchAll();
      setOrders(data);
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = {};
        err.inner.forEach((validationError) => {
          errors[validationError.path] = validationError.message;
        });
        setFormErrors(errors);
      }
    }
  };

  return {
    orders: enhancedOrders,
    clients,
    products,
    productMap,
    formState,
    isModalOpen,
    modalType,
    selectedOrder,
    selectedRowId,
    totalValue,
    setSelectedRowId,
    handleCreate,
    handleEdit,
    handleDelete,
    handleView,
    handleRemoveItem,
    handleInputChange,
    handleQuantityChange,
    handleDateChange,
    handleSubmit,
    formErrors,
    closeModal,
    generateOrderCsvReport
  };
}
