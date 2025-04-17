import { categoryService } from '@/api/categoryService';
import { useState, useEffect } from 'react';

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [formState, setFormState] = useState({ name: '', description: '', productCount: 0 });
  const [modalType, setModalType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategories = async () => {
    const { data } = await categoryService.fetchAll();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (type, row = { name: '', description: '' }) => {
    setFormState(row);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCreate = () => handleOpenModal('create');

  const handleEdit = () => {
    const selectedRow = categories.find(({ categoryId }) => categoryId === selectedRowId);
    if (selectedRow) handleOpenModal('edit', selectedRow);
  };

  const handleDelete = async () => {
    if (!selectedRowId) return;
    await categoryService.remove(selectedRowId);
    await fetchCategories();
    setSelectedRowId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalType === 'create') {
      await categoryService.create(formState);
    } else {
      await categoryService.update(selectedRowId, formState);
    }
    setIsModalOpen(false);
    await fetchCategories();
  };

  const handleInputChange = ({ target: { name, value } }) => setFormState((prev) => ({ ...prev, [name]: value }));

  return {
    categories,
    selectedRowId,
    setSelectedRowId,
    formState,
    handleInputChange,
    isModalOpen,
    modalType,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleCloseModal: () => {
      setIsModalOpen(false);
      setSelectedRowId(null);
    }
  };
};
