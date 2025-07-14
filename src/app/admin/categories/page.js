'use client';

import { useCategoryManagement } from '@/hooks/useCategoryManagement';
import React from 'react';

import GenericDataGrid from '@/components/DataGrid/DataGrid';
import GenericForm from '@/components/Form/Form';
import GenericModal from '@/components/Modal/Modal';

import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

export default function CategoryManagement() {
  const {
    categories,
    selectedRowId,
    setSelectedRowId,
    formState,
    formErrors,
    handleInputChange,
    isModalOpen,
    modalType,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleCloseModal
  } = useCategoryManagement();

  return (
    <React.Fragment>
      <GenericDataGrid
        key={categories.length}
        rows={categories.map((category) => ({
          id: category.categoryId,
          ...category
        }))}
        columns={[
          { field: 'name', headerName: 'Name', width: 150 },
          { field: 'description', headerName: 'Description', width: 200 },
          { field: 'productCount', headerName: 'Product Count', width: 150 }
        ]}
        pageSizeOptions={[10, 25, 50]}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        setSelectedRowId={setSelectedRowId}
        selectedRowId={selectedRowId}
        additionalActions={[
          { label: 'Create', icon: <AddIcon />, onClick: handleCreate },
          { label: 'Edit', icon: <EditIcon />, onClick: handleEdit, needsSelection: true },
          { label: 'Delete', icon: <DeleteIcon />, onClick: handleDelete, needsSelection: true }
        ]}
      />
      <GenericModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        title={modalType === 'edit' ? 'Edit Category' : 'Create Category'}
      >
        <GenericForm
          formState={formState}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          fields={[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'description', label: 'Description', type: 'text' }
          ]}
          formErrors={formErrors}
          submitLabel={modalType === 'edit' ? 'Update' : 'Create'}
        />
      </GenericModal>
    </React.Fragment>
  );
}
