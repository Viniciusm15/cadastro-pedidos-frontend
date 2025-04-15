'use client';

import { categoryService } from '@/api/categoryService';

import GenericDataGrid from '@/components/DataGrid/DataGrid';
import GenericForm from '@/components/Form/Form';
import GenericModal from '@/components/Modal/Modal';

import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

import React, { useState, useEffect } from 'react';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    productCount: 0
  });

  useEffect(() => {
    categoryService.fetchAll().then(({ data }) => setCategories(data));
  }, []);

  const handleOpenModal = (type, row = { name: '', description: '' }) => {
    setFormState(row);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCreate = () => handleOpenModal('create');

  const handleEdit = () => {
    if (selectedRowId) {
      const selectedRow = categories.find(({ categoryId }) => categoryId === selectedRowId);
      if (selectedRow) {
        handleOpenModal('edit', selectedRow);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedRowId) {
      await categoryService.remove(selectedRowId);
      categoryService.fetchAll().then(({ data }) => {
        setCategories(data);
        setSelectedRowId(null);
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRowId(null);
  };

  const handleInputChange = ({ target: { name, value } }) => setFormState((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalType === 'create') {
      await categoryService.create(formState);
    } else if (modalType === 'edit') {
      await categoryService.update(selectedRowId, formState);
    }
    setIsModalOpen(false);
    categoryService.fetchAll().then(({ data }) => setCategories(data));
  };

  return (
    <React.Fragment>
      <GenericDataGrid
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
          { label: 'Create', icon: <EditIcon />, onClick: handleCreate },
          {
            label: 'Edit',
            icon: <EditIcon />,
            onClick: handleEdit,
            needsSelection: true
          },
          {
            label: 'Delete',
            icon: <DeleteIcon />,
            onClick: handleDelete,
            needsSelection: true
          }
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
          submitLabel={modalType === 'edit' ? 'Update' : 'Create'}
        />
      </GenericModal>
    </React.Fragment>
  );
}
