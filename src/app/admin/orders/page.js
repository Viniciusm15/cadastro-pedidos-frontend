'use client';

import { useOrderManagement } from '@/hooks/useOrderManagement';
import { GenericDataTable } from '@/components/DataTable/DataTable';
import GenericForm from '@/components/Form/Form';
import GenericModal from '@/components/Modal/Modal';
import { GenericActionButton } from '@/components/ActionButton/ActionButton';
import { GenericSnackbar } from '@/components/SnackBar/SnackBar';
import { GenericStatusChip } from '@/components/StatusChip/StatusChip';
import GenericView from '@/components/View/View';
import GenericHeader from '@/components/Header/Header';
import GenericList from '@/components/List/List';
import GenericDatePicker from '@/components/DatePicker/DatePicker';
import GenericSelect from '@/components/Select/Select';
import GenericInput from '@/components/Input/Input';
import { OrderStatusOptions } from '@/enums/OrderStatus';

import { Add, Edit, Delete, Refresh, Visibility, FileDownload } from '@mui/icons-material';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

export default function OrderManagement() {
  const {
    orders,
    isModalOpen,
    modalType,
    selectedRowId,
    selectedOrder,
    formState,
    formErrors,
    setSelectedRowId,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleRemoveItem,
    handleCloseModal,
    handleInputChange,
    handleDateChange,
    handleQuantityChange,
    handleSubmit,
    refreshData,
    snackbar,
    closeSnackbar,
    pagination,
    clients,
    products,
    productMap,
    generateOrderCsvReport
  } = useOrderManagement();

  const getOrderColumns = () => [
    {
      field: 'clientName',
      headerName: 'Client',
      width: '25%',
      maxLength: 30,
    },
    {
      field: 'orderDate',
      headerName: 'Order Date',
      width: '20%',
      render: (row) => dayjs(row.orderDate).format('MM/DD/YYYY')
    },
    {
      field: 'totalValue',
      headerName: 'Total Value',
      width: '20%',
      align: 'right',
      render: (row) => `$${row.totalValue.toFixed(2)}`
    },
    {
      field: 'status',
      headerName: 'Status',
      width: '20%',
      render: (row) => (
        <GenericStatusChip status={row.status} />
      )
    }
  ];

  const orderInfoItems = [
    { label: 'Client', value: selectedOrder?.clientName },
    {
      label: 'Order Date',
      value: selectedOrder?.orderDate ? dayjs(selectedOrder.orderDate).format('MMMM D, YYYY') : null
    },
    {
      label: 'Total Value',
      value: selectedOrder?.totalValue ? `$${selectedOrder.totalValue.toFixed(2)}` : null
    },
    {
      label: 'Status',
      value: <GenericStatusChip status={selectedOrder?.status} />
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <GenericDataTable
        title="Order Management"
        maxTextLength={40}
        columns={getOrderColumns()}
        data={orders.data}
        totalCount={orders.totalCount}
        page={pagination.pagination.page}
        rowsPerPage={pagination.pagination.rowsPerPage}
        onPageChange={pagination.handlePageChange}
        onRowsPerPageChange={pagination.handleRowsPerPageChange}
        selectedRowId={selectedRowId}
        setSelectedRowId={(orderId) => { setSelectedRowId(orderId); }}
        rowIdField="orderId"
        actionButtons={[
          <GenericActionButton
            key="export"
            icon={<FileDownload />}
            tooltip="Export CSV"
            onClick={generateOrderCsvReport}
          />,
          <GenericActionButton
            key="create"
            icon={<Add />}
            tooltip="Add new order"
            onClick={handleCreate}
          />,
          <GenericActionButton
            key="view"
            icon={<Visibility />}
            onClick={handleView}
            disabled={!selectedRowId}
            tooltip="View order details"
          />,
          <GenericActionButton
            key="edit"
            icon={<Edit />}
            onClick={handleEdit}
            disabled={!selectedRowId}
            tooltip="Edit order"
          />,
          <GenericActionButton
            key="delete"
            icon={<Delete />}
            onClick={handleDelete}
            disabled={!selectedRowId}
            tooltip="Delete order"
          />,
          <GenericActionButton
            key="refresh"
            icon={<Refresh />}
            tooltip="Refresh list"
            onClick={refreshData}
          />
        ]}
      />

      <GenericModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        title={modalType === 'edit' ? 'Edit Order' : modalType === 'view' ? 'Order Details' : 'New Order'}
      >
        {modalType === 'view' && selectedOrder ? (
          <React.Fragment>
            <GenericView title='Order Information' items={orderInfoItems} />
            <GenericHeader title='Order Items' count={selectedOrder?.orderItems?.length || 0} />

            <GenericList
              items={selectedOrder?.orderItems}
              primaryText={(item) => `${item.productName} - $${item.unitaryPrice.toFixed(2)}`}
              secondaryText={(item) => (
                <React.Fragment>
                  Qty: {item.quantity} | Subtotal: ${item.subtotal.toFixed(2)}
                </React.Fragment>
              )}
            />
          </React.Fragment>
        ) : (
          <GenericForm
            formState={formState}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            fields={[]}
            additionalFields={
              <React.Fragment>
                <GenericDatePicker
                  label='Order Date'
                  value={formState.orderDate || null}
                  onChange={handleDateChange}
                  error={formErrors.orderDate}
                />
                <GenericSelect
                  label='Client'
                  name='clientId'
                  value={formState.clientId || ''}
                  onChange={handleInputChange}
                  options={clients.map(({ clientId, name }) => ({
                    value: clientId,
                    label: name
                  }))}
                  error={formErrors.clientId}
                />
                {modalType === 'edit' && (
                  <GenericSelect
                    label="Status"
                    name="status"
                    value={formState.status ?? OrderStatus.PENDING.value}
                    onChange={handleInputChange}
                    options={OrderStatusOptions}
                    error={formErrors.status}
                  />
                )}
                <GenericSelect
                  label='Products'
                  name='orderItems'
                  multiple
                  value={formState.orderItems?.map((item) => item.productId) || []}
                  onChange={handleInputChange}
                  options={products.map(({ productId, name }) => ({
                    value: productId,
                    label: name
                  }))}
                  error={formErrors.orderItems}
                  onRemoveItem={handleRemoveItem}
                />
                {formState.orderItems?.map((item, index) => {
                  const product = productMap[item.productId];
                  return (
                    <div key={`order-item-${item.productId || index}`}>
                      <GenericInput
                        label={product ? product.name : 'Unknown product'}
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
            formErrors={formErrors}
            submitLabel={modalType === 'edit' ? 'Update' : 'Create'}
          />
        )}
      </GenericModal>

      <GenericSnackbar
        open={snackbar.open}
        onClose={closeSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
}
