'use client';

import { useClientManagement } from '@/hooks/useClientManagement';
import { GenericDataTable } from '@/components/DataTable/DataTable';
import GenericForm from '@/components/Form/Form';
import GenericModal from '@/components/Modal/Modal';
import { GenericActionButton } from '@/components/ActionButton/ActionButton';
import { GenericSnackbar } from '@/components/SnackBar/SnackBar';
import GenericView from '@/components/View/View';
import GenericHeader from '@/components/Header/Header';
import GenericList from '@/components/List/List';
import GenericDatePicker from '@/components/DatePicker/DatePicker';

import { Add, Edit, Delete, Refresh, Visibility } from '@mui/icons-material';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

export default function ClientManagement() {
  const {
    clients,
    isModalOpen,
    modalType,
    selectedRowId,
    selectedClient,
    formState,
    formErrors,
    setSelectedRowId,
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    handleCloseModal,
    handleInputChange,
    handleDateChange,
    handleSubmit,
    refreshData,
    snackbar,
    closeSnackbar,
    pagination
  } = useClientManagement();

  const getClientColumns = () => [
    {
      field: 'name',
      headerName: 'Name',
      width: '25%',
      maxLength: 30,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: '30%',
      maxLength: 40,
    },
    {
      field: 'telephone',
      headerName: 'Telephone',
      width: '20%',
    },
    {
      field: 'birthDate',
      headerName: 'Birth Date',
      width: '25%',
      render: (row) => dayjs(row.birthDate).format('MM/DD/YYYY')
    }
  ];

  const contactInfoItems = [
    { label: 'Name', value: selectedClient?.name },
    { label: 'Email', value: selectedClient?.email },
    { label: 'Telephone', value: selectedClient?.telephone },
    {
      label: 'Birth date',
      value: selectedClient?.birthDate ? dayjs(selectedClient.birthDate).format('MMMM D, YYYY') : null
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <GenericDataTable
        title="Client Management"
        maxTextLength={40}
        columns={getClientColumns()}
        data={clients.data}
        totalCount={clients.totalCount}
        page={pagination.pagination.page}
        rowsPerPage={pagination.pagination.rowsPerPage}
        onPageChange={pagination.handlePageChange}
        onRowsPerPageChange={pagination.handleRowsPerPageChange}
        selectedRowId={selectedRowId}
        setSelectedRowId={(clientId) => { setSelectedRowId(clientId); }}
        rowIdField="clientId"
        actionButtons={[
          <GenericActionButton
            key="create"
            icon={<Add />}
            tooltip="Add new client"
            onClick={handleCreate}
          />,
          <GenericActionButton
            key="view"
            icon={<Visibility />}
            onClick={handleView}
            disabled={!selectedRowId}
            tooltip="View client details"
          />,
          <GenericActionButton
            key="edit"
            icon={<Edit />}
            onClick={handleEdit}
            disabled={!selectedRowId}
            tooltip="Edit client"
          />,
          <GenericActionButton
            key="delete"
            icon={<Delete />}
            onClick={handleDelete}
            disabled={!selectedRowId}
            tooltip="Delete client"
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
        title={modalType === 'edit' ? 'Edit Client' : modalType === 'view' ? 'Client Details' : 'New Client'}
      >
        {modalType === 'view' && selectedClient ? (
          <React.Fragment>
            <GenericView title='Contact Information' items={contactInfoItems} />
            <GenericHeader title='Purchase History' count={selectedClient.purchaseHistory?.length || 0} />

            <GenericList
              items={selectedClient?.purchaseHistory}
              primaryText={(purchase) => `Order #${purchase.orderId.toString().padStart(6, '0')}`}
              secondaryText={(purchase) => (
                <React.Fragment>
                  {dayjs(purchase.orderDate).format('MMM D, YYYY')}
                  <span>
                    {purchase.totalValue.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}
                  </span>
                </React.Fragment>
              )}
            />
          </React.Fragment>
        ) : (
          <GenericForm
            formState={formState}
            handleInputChange={handleInputChange}
            handleSubmit={modalType === 'view' ? handleCloseModal : handleSubmit}
            fields={[
              { name: 'name', label: 'Client Name', type: 'text' },
              { name: 'email', label: 'Email', type: 'text' },
              { name: 'telephone', label: 'Telephone', type: 'text' }
            ]}
            additionalFields={
              <GenericDatePicker
                label='Birth Date'
                value={formState.birthDate || null}
                onChange={handleDateChange}
                error={formErrors.birthDate}
              />
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
