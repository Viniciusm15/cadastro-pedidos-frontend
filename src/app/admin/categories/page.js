'use client';

import { useCategoryManagement } from '@/hooks/useCategoryManagement';
import { GenericDataTable } from '@/components/DataTable/DataTable';
import GenericForm from '@/components/Form/Form';
import GenericModal from '@/components/Modal/Modal';
import { GenericActionButton } from '@/components/ActionButton/ActionButton';
import { GenericSnackbar } from '@/components/SnackBar/SnackBar';

import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import { Box } from '@mui/material';
import React from 'react';

export default function CategoryManagement() {
  const {
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
    handleSubmit,
    refreshData,
    snackbar,
    closeSnackbar,
    pagination
  } = useCategoryManagement();

  const getCategoryColumns = () => [
    {
      field: 'name',
      headerName: 'Name',
      width: '30%',
      maxLength: 50,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: '50%',
      maxLength: 80,
    },
    {
      field: 'productCount',
      headerName: 'Products',
      width: '20%',
      align: 'center',
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <GenericDataTable
        title="Category Management"
        maxTextLength={40}
        columns={getCategoryColumns()}
        data={categories.data}
        totalCount={categories.totalCount}
        page={pagination.pagination.page}
        rowsPerPage={pagination.pagination.rowsPerPage}
        onPageChange={pagination.handlePageChange}
        onRowsPerPageChange={pagination.handleRowsPerPageChange}
        selectedRowId={selectedRowId}
        setSelectedRowId={(categoryId) => { setSelectedRowId(categoryId); }}
        rowIdField="categoryId"
        actionButtons={[
          <GenericActionButton
            key="create"
            icon={<Add />}
            tooltip="Add new category"
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
        title={modalType === 'edit' ? 'Edit Category' : 'New Category'}
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

      <GenericSnackbar
        open={snackbar.open}
        onClose={closeSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
}
