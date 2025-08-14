'use client';

import { useProductManagement } from '@/hooks/useProductManagement';
import { GenericDataTable } from '@/components/DataTable/DataTable';
import GenericFileUploadButton from '@/components/FileUploadButton/FileUploadButton';
import GenericForm from '@/components/Form/Form';
import GenericModal from '@/components/Modal/Modal';
import GenericSelect from '@/components/Select/Select';
import { GenericActionButton } from '@/components/ActionButton/ActionButton';
import { GenericSnackbar } from '@/components/SnackBar/SnackBar';

import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import { Box } from '@mui/material';

import React from 'react';

export default function ProductManagement() {
  const {
    products,
    categories,
    isModalOpen,
    modalType,
    selectedRowId,
    formState,
    formErrors,
    setSelectedRowId,
    handleCreate,
    handleEdit,
    handleDelete,
    handleCloseModal,
    handleInputChange,
    handleFileUpload,
    handleSubmit,
    refreshData,
    snackbar,
    closeSnackbar,
    pagination
  } = useProductManagement();

  const getProductColumns = () => [
    {
      field: 'name',
      headerName: 'Name',
      width: '20%',
      maxLength: 50,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: '30%',
      maxLength: 80,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: '15%',
      align: 'right',
      render: (row) => `$${row.price.toFixed(2)}`
    },
    {
      field: 'stockQuantity',
      headerName: 'Stock',
      width: '10%',
      align: 'center',
    },
    {
      field: 'categoryName',
      headerName: 'Category',
      width: '10%',
      render: (row) => categories.find(cat => cat.categoryId === row.categoryId)?.name || 'N/A'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <GenericDataTable
        title="Product Management"
        maxTextLength={40}
        columns={getProductColumns()}
        data={products.data}
        totalCount={products.totalCount}
        page={pagination.pagination.page}
        rowsPerPage={pagination.pagination.rowsPerPage}
        onPageChange={pagination.handlePageChange}
        onRowsPerPageChange={pagination.handleRowsPerPageChange}
        selectedRowId={selectedRowId}
        setSelectedRowId={(productId) => { setSelectedRowId(productId); }}
        rowIdField="productId"
        actionButtons={[
          <GenericActionButton
            key="create"
            icon={<Add />}
            tooltip="Add new product"
            onClick={handleCreate}
          />,
          <GenericActionButton
            key="edit"
            icon={<Edit />}
            onClick={handleEdit}
            disabled={!selectedRowId}
          />,
          <GenericActionButton
            key="delete"
            icon={<Delete />}
            onClick={handleDelete}
            disabled={!selectedRowId}
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
        title={modalType === 'edit' ? 'Edit Product' : 'New Product'}
      >
        <GenericForm
          formState={formState}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          fields={[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'description', label: 'Description', type: 'text' },
            { name: 'price', label: 'Price', type: 'number', inputProps: { step: '0.01' } },
            { name: 'stockQuantity', label: 'Stock Quantity', type: 'number' }
          ]}
          additionalFields={
            <React.Fragment>
              <GenericSelect
                label='Category'
                name='categoryId'
                value={formState.categoryId}
                onChange={handleInputChange}
                options={[
                  ...(!categories.some(cat => cat.categoryId === formState.categoryId) && formState.categoryId
                    ? [{ value: formState.categoryId, label: 'N/A' }]
                    : []),
                  ...categories.map((category) => ({
                    value: category.categoryId,
                    label: category.name
                  }))
                ]}
                error={formErrors.categoryId}
              />
              <GenericFileUploadButton
                onUpload={handleFileUpload}
                accept='image/*'
                buttonText='Upload Product Image'
                error={formErrors.image}
                initialFile={formState.imageFile}
              />
            </React.Fragment>
          }
          formErrors={formErrors}
          submitLabel={modalType === 'edit' ? 'Update' : 'Create'}
        />
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
