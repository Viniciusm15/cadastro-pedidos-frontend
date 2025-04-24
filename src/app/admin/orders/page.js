'use client';

import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import React from 'react';

import GenericDataGrid from '@/components/DataGrid/DataGrid';
import GenericDatePicker from '@/components/DatePicker/DatePicker';
import GenericForm from '@/components/Form/Form';
import GenericHeader from '@/components/Header/Header';
import GenericInput from '@/components/Input/Input';
import GenericList from '@/components/List/List';
import GenericModal from '@/components/Modal/Modal';
import GenericSelect from '@/components/Select/Select';
import GenericView from '@/components/View/View';

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
    formErrors,
    clients,
    products,
    productMap,
    handleCreate,
    handleEdit,
    handleView,
    handleRemoveItem,
    handleDelete,
    handleInputChange,
    handleDateChange,
    handleQuantityChange,
    handleSubmit,
    closeModal,
    generateOrderCsvReport
  } = useOrderManagement();

  const orderInfoItems = [
    { label: 'Client', value: selectedOrder?.clientName },
    { label: 'Order Date', value: formatDate(selectedOrder?.orderDate) },
    { label: 'Total Value', value: selectedOrder?.totalValue?.toFixed(2) },
    { label: 'Status', value: selectedOrder?.statusDescription }
  ];

  return (
    <React.Fragment>
      <GenericDataGrid
        key={orders.length}
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
          <React.Fragment>
            <GenericView title='Order Information' items={orderInfoItems} />
            <GenericHeader title='Order Items' count={selectedOrder?.orderItems?.length || 0} />

            <GenericList
              items={selectedOrder?.orderItems}
              primaryText={(purchase) => `${purchase.productName} $${purchase.unitaryPrice.toFixed(2)}`}
              secondaryText={(purchase) => (
                <React.Fragment>
                  {purchase.productName} x{purchase.quantity} - Subtotal: ${purchase.subtotal.toFixed(2)}
                </React.Fragment>
              )}
            />
          </React.Fragment>
        ) : (
          <GenericForm
            formState={formState}
            handleInputChange={handleInputChange}
            handleDateChange={handleDateChange}
            handleSubmit={handleSubmit}
            fields={[]}
            additionalFields={
              <React.Fragment>
                <GenericDatePicker
                  label='Order Date'
                  value={dayjs(formState.orderDate)}
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
    </React.Fragment>
  );
}
