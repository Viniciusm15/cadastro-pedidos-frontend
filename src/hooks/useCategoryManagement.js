import { categoryService } from '@/api/categoryService';
import { categorySchema } from '@/schemas/categorySchema';
import { useState, useEffect, useCallback } from 'react';
import { usePagination } from '@/hooks/usePaginationManagement';

const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  productCount: 0
};

export function useCategoryManagement() {
  const [categories, setCategories] = useState({ data: [], totalCount: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const pagination = usePagination();

  const resetForm = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
    setFormErrors({});
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const loadData = useCallback(async () => {
    try {
      const categoriesRes = await categoryService.fetchAll(
        pagination.apiParams.pageNumber,
        pagination.apiParams.pageSize
      );

      setCategories({
        data: categoriesRes.data,
        totalCount: categoriesRes.totalCount
      });
    } catch (error) {
      showSnackbar('Error loading categories', 'error');
    }
  }, [pagination.apiParams.pageNumber, pagination.apiParams.pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = () => {
    loadData();
  };

  const handleOpenModal = useCallback((type, rowData = null) => {
    setFormErrors({});

    setFormState({
      ...INITIAL_FORM_STATE,
      ...rowData
    });

    setModalType(type);
    setIsModalOpen(true);
  }, [resetForm]);

  const handleCreate = useCallback(() => {
    resetForm();
    handleOpenModal('create');
  }, [handleOpenModal, resetForm]);

  const handleEdit = useCallback(() => {
    if (!selectedRowId) return;
    handleOpenModal('edit', categories.data.find(c => c.categoryId === selectedRowId));
  }, [selectedRowId, categories.data, handleOpenModal]);

  const handleDelete = useCallback(async () => {
    if (!selectedRowId) return;

    try {
      await categoryService.remove(selectedRowId);
      showSnackbar('Category deleted successfully');
      refreshData();
      setSelectedRowId(null);
    } catch (error) {
      showSnackbar('Error deleting category', 'error');
    }
  }, [selectedRowId]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRowId(null);
    resetForm();
  }, [resetForm]);

  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    try {
      await categorySchema.validate(formState, { abortEarly: false });
      setFormErrors({});

      if (modalType === 'create') {
        await categoryService.create(formState);
        showSnackbar('Category created successfully');
      } else if (modalType === 'edit') {
        await categoryService.update(selectedRowId, formState);
        showSnackbar('Category updated successfully');
      }

      refreshData();
      handleCloseModal();
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = {};
        err.inner.forEach(({ path, message }) => {
          errors[path] = message;
        });
        setFormErrors(errors);
      } else {
        showSnackbar('Error saving category', 'error');
      }
    }
  }, [formState, modalType, selectedRowId, handleCloseModal]);

  return {
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
  };
}
