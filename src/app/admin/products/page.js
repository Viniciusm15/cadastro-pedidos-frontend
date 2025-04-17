'use client';

import { useProductManagement } from '@/hooks/useProductManagement';

import GenericDataGrid from '@/components/DataGrid/DataGrid';
import GenericFileUploadButton from '@/components/FileUploadButton/FileUploadButton';
import GenericForm from '@/components/Form/Form';
import GenericModal from '@/components/Modal/Modal';
import GenericSelect from '@/components/Select/Select';

import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

import React from 'react';

export default function ProductManagement() {
  const {
    products,
    categories,
    isModalOpen,
    modalType,
    selectedRowId,
    formState,
    setSelectedRowId,
    handleCreate,
    handleEdit,
    handleDelete,
    handleCloseModal,
    handleInputChange,
    handleFileUpload,
    handleSubmit
  } = useProductManagement();

  return (
    <React.Fragment>
      <GenericDataGrid
        key={products.length}
        rows={products.map((product) => ({
          id: product.productId,
          categoryName: categories.find((cat) => cat.categoryId === product.categoryId)?.name || 'N/A',
          ...product
        }))}
        columns={[
          { field: 'name', headerName: 'Name', width: 150 },
          { field: 'description', headerName: 'Description', width: 200 },
          { field: 'price', headerName: 'Price', width: 100 },
          { field: 'stockQuantity', headerName: 'Stock Quantity', width: 150 },
          { field: 'categoryName', headerName: 'Category', width: 150 }
        ]}
        pageSizeOptions={[10, 25, 50]}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        setSelectedRowId={setSelectedRowId}
        selectedRowId={selectedRowId}
        additionalActions={[
          { label: 'Create', icon: <EditIcon />, onClick: handleCreate },
          { label: 'Edit', icon: <EditIcon />, onClick: handleEdit, needsSelection: true },
          { label: 'Delete', icon: <DeleteIcon />, onClick: handleDelete, needsSelection: true }
        ]}
      />
      <GenericModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        title={modalType === 'edit' ? 'Edit Product' : 'Create Product'}
      >
        <GenericForm
          formState={formState}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          fields={[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'description', label: 'Description', type: 'text' },
            { name: 'price', label: 'Price', type: 'number' },
            { name: 'stockQuantity', label: 'Stock Quantity', type: 'number' }
          ]}
          additionalFields={
            <React.Fragment>
              <GenericSelect
                label='Category'
                name='categoryId'
                value={formState.categoryId}
                onChange={handleInputChange}
                options={categories.map((category) => ({
                  value: category.categoryId,
                  label: category.name
                }))}
              />
              <GenericFileUploadButton onUpload={handleFileUpload} accept='image/*' buttonText='Upload Product Image' />
            </React.Fragment>
          }
          submitLabel={modalType === 'edit' ? 'Update' : 'Create'}
        />
      </GenericModal>
    </React.Fragment>
  );
}
