'use client';

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import React from 'react';

import GenericDataGrid from '@/components/DataGrid/DataGrid';
import GenericDatePicker from '@/components/DatePicker/DatePicker';
import GenericForm from '@/components/Form/Form';
import GenericInput from '@/components/Input/Input';
import GenericList from '@/components/List/List';
import GenericModal from '@/components/Modal/Modal';
import GenericSelect from '@/components/Select/Select';

import useOrderManagement from '@/hooks/useOrderManagement';

const formatDate = (date) => dayjs(date).format('MM/DD/YYYY');

export default function OrderManagement() {
  const {
    orders,
    selectedRowId,
    setSelectedRowId,
    isModalOpen,
    modalType,
    selectedOrder,
    formState,
    clients,
    products,
    productMap,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleInputChange,
    handleDateChange,
    handleQuantityChange,
    handleSubmit,
    closeModal,
    generateOrderCsvReport
  } = useOrderManagement();

  return (
    <React.Fragment>
      <GenericDataGrid
        rows={orders.map(({ orderId, clientName, orderDate, totalValue, statusDescription }) => ({
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
          { label: 'Export CSV', icon: <FileDownloadIcon />, onClick: generateOrderCsvReport, needsSelection: false },
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
            {selectedOrder?.orderItems?.length > 0 ? (
              <GenericList
                items={selectedOrder.orderItems.map((item) => ({
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
                  options={clients.map(({ clientId, name }) => ({
                    value: clientId,
                    label: name
                  }))}
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
            submitLabel={modalType === 'edit' ? 'Update' : 'Create'}
          />
        )}
      </GenericModal>
    </React.Fragment>
  );
}
