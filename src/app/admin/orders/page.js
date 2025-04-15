'use client';

import { clientService } from '@/api/clientService';
import { fetchOrderItemsByOrderId } from '@/api/orderItemService';
import { orderService } from '@/api/orderService';
import { fetchProducts } from '@/api/productService';

import GenericDataGrid from '@/components/DataGrid/DataGrid';
import GenericDatePicker from '@/components/DatePicker/DatePicker';
import GenericForm from '@/components/Form/Form';
import GenericInput from '@/components/Input/Input';
import GenericList from '@/components/List/List';
import GenericModal from '@/components/Modal/Modal';
import GenericSelect from '@/components/Select/Select';

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import Typography from '@mui/material/Typography';

import dayjs from 'dayjs';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

const formatDate = (date) => dayjs(date).format('MM/DD/YYYY');

export default function OrderManagement() {
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
    clientId: '',
    orderDate: dayjs(),
    orderItems: [],
    totalValue: 0
  });

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
      clientName: getClientName(order.clientId)
    }));
  }, [orders, clients, getClientName]);

  const openModal = (type, row = {}) => {
    setFormState(row);
    setModalType(type);
    setIsModalOpen(true);
    if (type === 'create' && !row.orderItems) {
      setFormState((prev) => ({ ...prev, orderItems: [] }));
    }
  };

  const handleView = useCallback(async () => {
    const order = orders.find(({ orderId }) => orderId === selectedRowId);
    if (order) {
      const orderItemsRes = await fetchOrderItemsByOrderId(order.orderId);
      const enhancedOrder = {
        ...order,
        clientName: getClientName(order.clientId),
        orderItems: orderItemsRes
      };
      setSelectedOrder(enhancedOrder);
      openModal('view', enhancedOrder);
    }
  }, [orders, selectedRowId, getClientName]);

  const handleCreate = useCallback(() => openModal('create', {}), []);

  const handleEdit = useCallback(async () => {
    const order = orders.find(({ orderId }) => orderId === selectedRowId);
    if (order) {
      const orderItemsRes = await fetchOrderItemsByOrderId(order.orderId);
      const orderItemsFormatted = orderItemsRes
        .map((item) =>
          productMap[item.productId]
            ? { ...item, productName: productMap[item.productId].name, subtotal: item.quantity * item.unitaryPrice }
            : null
        )
        .filter(Boolean);

      const enhancedOrder = {
        ...order,
        clientName: getClientName(order.clientId),
        orderItems: orderItemsFormatted
      };

      setSelectedOrder(enhancedOrder);
      setFormState({
        ...enhancedOrder,
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

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRowId(null);
  }, []);

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
      setFormState((prev) => ({ ...prev, orderItems: selectedProducts }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setFormState((prev) => ({
        ...prev,
        orderItems: prev.orderItems.filter((item) => item.productId !== productId)
      }));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      orderItems: prev.orderItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: parsedQuantity, subtotal: parsedQuantity * item.unitaryPrice }
          : item
      )
    }));
  };

  const handleDateChange = (date) =>
    setFormState((prev) => ({
      ...prev,
      orderDate: dayjs(date).isValid() ? dayjs(date) : prev.orderDate
    }));

  const totalValue = useMemo(() => {
    if (!Array.isArray(formState.orderItems)) {
      return 0;
    }
    return formState.orderItems.reduce((sum, item) => sum + item.quantity * item.unitaryPrice, 0);
  }, [formState.orderItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      ...formState,
      orderDate: formState.orderDate ? dayjs(formState.orderDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      totalValue: totalValue,
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

    if (modalType === 'create') {
      await create(orderData);
    } else if (modalType === 'edit') {
      await update(selectedRowId, orderData);
    }

    closeModal();
    fetchAll().then(({ data }) => setOrders(data));
  };

  return (
    <React.Fragment>
      <GenericDataGrid
        rows={enhancedOrders.map(({ orderId, clientName, orderDate, totalValue, statusDescription }) => ({
          id: orderId,
          clientName,
          orderDate: formatDate(orderDate),
          totalValue,
          statusDescription
        }))}
        columns={[
          { field: 'clientName', headerName: 'Client', width: 150 },
          { field: 'orderDate', headerName: 'Order Date', width: 150 },
          { field: 'totalValue', headerName: 'Total Value', width: 150 },
          { field: 'statusDescription', headerName: 'Status', width: 150 }
        ]}
        pageSizeOptions={[10, 25, 50]}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        setSelectedRowId={setSelectedRowId}
        selectedRowId={selectedRowId}
        additionalActions={[
          {
            label: 'Export',
            icon: <FileDownloadIcon />,
            onClick: generateOrderCsvReport,
            needsSelection: false
          },
          { label: 'Create', icon: <EditIcon />, onClick: handleCreate },
          { label: 'Edit', icon: <EditIcon />, onClick: handleEdit, needsSelection: true },
          { label: 'View', icon: <VisibilityIcon />, onClick: handleView, needsSelection: true },
          { label: 'Delete', icon: <DeleteIcon />, onClick: handleDelete, needsSelection: true }
        ]}
      />
      <GenericModal
        open={isModalOpen}
        handleClose={closeModal}
        title={modalType === 'edit' ? 'Edit Order' : modalType === 'view' ? 'View Order' : 'Create Order'}
      >
        {modalType === 'view' ? (
          <div>
            <Typography variant='h6'>Client: {selectedOrder?.clientName}</Typography>
            <Typography variant='h6'>Order Date: {formatDate(selectedOrder?.orderDate)}</Typography>
            <Typography variant='h6'>Total Value: ${selectedOrder?.totalValue?.toFixed(2)}</Typography>
            <Typography variant='h6'>Status: {selectedOrder?.statusDescription}</Typography>
            <Typography variant='h6'>Items:</Typography>
            {selectedOrder?.orderItems && selectedOrder.orderItems.length > 0 ? (
              <GenericList
                items={selectedOrder?.orderItems.map((item) => ({
                  key: item.orderItemId,
                  id: item.orderItemId,
                  productName: item.productName,
                  description: `${item.productName} x${item.quantity} - $${item.unitaryPrice.toFixed(2)} (Subtotal: $${item.subtotal.toFixed(2)})`
                }))}
                primaryText={(item) => item.productName}
                secondaryText={(item) => item.description}
                emptyMessage='No items found for this order.'
              />
            ) : (
              <Typography variant='h6'>No items found for this order.</Typography>
            )}
          </div>
        ) : (
          <GenericForm
            formState={formState}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            handleSubmit={handleSubmit}
            fields={[{ name: 'totalValue', label: 'Total Value', type: 'number', readOnly: true }]}
            additionalFields={
              <React.Fragment>
                <GenericDatePicker label='Order Date' value={dayjs(formState.orderDate)} onChange={handleDateChange} />
                <GenericSelect
                  label='Client'
                  name='clientId'
                  value={formState.clientId || ''}
                  onChange={handleInputChange}
                  options={clients.map(({ clientId, name }) => ({ value: clientId, label: name }))}
                />
                <GenericSelect
                  label='Products'
                  name='orderItems'
                  value={formState.orderItems?.map((item) => item.productId) || []}
                  onChange={handleInputChange}
                  options={products.map(({ productId, name }) => ({
                    value: productId,
                    label: name
                  }))}
                  multiple
                  renderValue={(selected) => {
                    const selectedItems = products.filter((product) => selected.includes(product.productId));
                    return selectedItems.map((item) => <span key={item.productId}>{item.name}</span>);
                  }}
                />
                {formState.orderItems?.map((item, index) => {
                  const product = productMap[item.productId];
                  return (
                    <div key={`order-item-${item.productId || index}`}>
                      <GenericInput
                        label={`${product ? product.name : 'Unknown product'}`}
                        value={item.quantity || 1}
                        onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                        type='number'
                        min={1}
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            }
            submitLabel={modalType === 'edit' ? 'Update' : 'Create'}
          />
        )}
      </GenericModal>
    </React.Fragment>
  );
}
