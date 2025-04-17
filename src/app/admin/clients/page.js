'use client';

import GenericDataGrid from '@/components/DataGrid/DataGrid';
import GenericDatePicker from '@/components/DatePicker/DatePicker';
import GenericForm from '@/components/Form/Form';
import GenericList from '@/components/List/List';
import GenericModal from '@/components/Modal/Modal';

import styles from '@/styles/base/pages/clientManagement.module.css';

import { Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import Typography from '@mui/material/Typography';

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
          { label: 'Create', icon: <EditIcon />, onClick: handleCreate },
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
            <Typography>Name: {selectedClient.name}</Typography>
            <Typography>Email: {selectedClient.email}</Typography>
            <GenericList
              items={selectedClient.purchaseHistory}
              primaryText={(purchase) => `Order ID: ${purchase.orderId}`}
              secondaryText={(purchase) => (
                <React.Fragment>
                  <Typography component='span' className={styles.purchaseDate}>
                    Order Date: {dayjs(purchase.orderDate).format('MM/DD/YYYY')}
                  </Typography>
                  <Typography component='span' className={styles.totalValue}>
                    Total Value:{' '}
                    {purchase.totalValue.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    })}
                  </Typography>
                </React.Fragment>
              )}
              emptyMessage='No purchase history available'
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
              />
            }
            submitLabel={modalType === 'edit' ? 'Update' : modalType === 'view' ? 'Close' : 'Create'}
          />
        )}
      </GenericModal>
    </React.Fragment>
  );
}
