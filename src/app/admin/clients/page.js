'use client';

import GenericDataGrid from '@/components/DataGrid/DataGrid';
import GenericDatePicker from '@/components/DatePicker/DatePicker';
import GenericForm from '@/components/Form/Form';
import GenericHeader from '@/components/Header/Header';
import GenericList from '@/components/List/List';
import GenericModal from '@/components/Modal/Modal';
import GenericView from '@/components/View/View';

import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

import useClientManagement from '@/hooks/useClientManagement';
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
    closeModal,
    handleInputChange,
    handleDateChange,
    handleSubmit
  } = useClientManagement();

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
    <React.Fragment>
      <GenericDataGrid
        key={clients.length}
        rows={clients.map((client) => ({ id: client.clientId, ...client }))}
        columns={[
          { field: 'name', headerName: 'Name', width: 150 },
          { field: 'email', headerName: 'Email', width: 200 },
          { field: 'telephone', headerName: 'Telephone', width: 150 },
          {
            field: 'birthDate',
            headerName: 'Birth Date',
            width: 150,
            valueFormatter: (params) => dayjs(params).format('MM/DD/YYYY')
          }
        ]}
        pageSizeOptions={[10, 25, 50]}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        setSelectedRowId={setSelectedRowId}
        selectedRowId={selectedRowId}
        additionalActions={[
          { label: 'Create', icon: <AddIcon />, onClick: handleCreate },
          { label: 'View', icon: <VisibilityIcon />, onClick: handleView, needsSelection: true },
          { label: 'Edit', icon: <EditIcon />, onClick: handleEdit, needsSelection: true },
          { label: 'Delete', icon: <DeleteIcon />, onClick: handleDelete, needsSelection: true }
        ]}
      />

      <GenericModal
        open={isModalOpen}
        handleClose={closeModal}
        title={modalType === 'edit' ? 'Edit Client' : modalType === 'view' ? 'View Client' : 'Create Client'}
      >
        {modalType === 'view' && selectedClient ? (
          <React.Fragment>
            <GenericView title='Contact Information' items={contactInfoItems} />
            <GenericHeader title='Purchase History' count={selectedClient.purchaseHistory?.length || 0} />

            <GenericList
              items={selectedClient.purchaseHistory}
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
            handleDateChange={handleDateChange}
            handleSubmit={modalType === 'view' ? closeModal : handleSubmit}
            fields={[
              { name: 'name', label: 'Client Name', type: 'text', disabled: modalType === 'view' },
              { name: 'email', label: 'Email', type: 'text', disabled: modalType === 'view' },
              { name: 'telephone', label: 'Telephone', type: 'text', disabled: modalType === 'view' }
            ]}
            additionalFields={
              <GenericDatePicker
                label='Birth Date'
                value={formState.birthDate || null}
                onChange={handleDateChange}
                disabled={modalType === 'view'}
                error={formErrors.birthDate}
              />
            }
            formErrors={formErrors}
            submitLabel={modalType === 'edit' ? 'Update' : modalType === 'view' ? 'Close' : 'Create'}
          />
        )}
      </GenericModal>
    </React.Fragment>
  );
}
