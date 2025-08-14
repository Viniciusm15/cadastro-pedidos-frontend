import { categoryService } from '@/api/categoryService';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/api/productService';
import { base64ToFile } from '@/utils/FileUtils';
import { productSchema } from '@/schemas/productSchema';
import { useState, useEffect, useCallback } from 'react';
import { usePagination } from '@/hooks/usePaginationManagement';

const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  categoryId: '',
  image: null
};

export function useProductManagement() {
  const [products, setProducts] = useState({ data: [], totalCount: 0 });
  const [categories, setCategories] = useState([]);
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
      const [productsRes, categoriesRes] = await Promise.all([
        fetchProducts(pagination.apiParams),
        categoryService.fetchAll()
      ]);

      setProducts({
        data: productsRes.data,
        totalCount: productsRes.totalCount
      });
      setCategories(categoriesRes.data);
    } catch (error) {
      showSnackbar('Error loading products', 'error');
    }
  }, [pagination.apiParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refreshData = () => {
    loadData();
  };

  const handleOpenModal = useCallback((type, rowData = null) => {
    setFormErrors({});

    let initialFile = null;
    if (type === 'edit' && rowData?.image) {
      initialFile = base64ToFile(
        rowData.image.imageData,
        rowData.image.description,
        rowData.image.imageMimeType
      );

      handleFileUpload(initialFile);
    }

    setFormState({
      ...INITIAL_FORM_STATE,
      ...rowData,
      imageFile: initialFile
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
    handleOpenModal('edit', products.data.find(p => p.productId === selectedRowId));
  }, [selectedRowId, products.data, handleOpenModal]);

  const handleDelete = useCallback(async () => {
    if (!selectedRowId) return;

    try {
      await deleteProduct(selectedRowId);
      showSnackbar('Product deleted successfully');
      refreshData();
      setSelectedRowId(null);
    } catch (error) {
      showSnackbar('Error deleting product', 'error');
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
      [name]: name === 'price' || name === 'stockQuantity' ? Number(value) || 0 : value
    }));
  }, []);

  const handleFileUpload = useCallback((file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const base64String = reader.result.split(',')[1];
        setFormState(prev => ({
          ...prev,
          image: {
            description: file.name.replace(/\.[^/.]+$/, ''),
            imageMimeType: file.type,
            imageData: base64String
          }
        }));
      } catch (error) {
        showSnackbar('Error processing image', 'error');
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    try {
      await productSchema.validate(formState, { abortEarly: false });
      setFormErrors({});

      if (modalType === 'create') {
        await createProduct(formState);
        showSnackbar('Product created successfully');
      } else if (modalType === 'edit') {
        await updateProduct(selectedRowId, formState);
        showSnackbar('Product updated successfully');
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
        showSnackbar('Error saving product', 'error');
      }
    }
  }, [formState, modalType, selectedRowId, handleCloseModal]);

  return {
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
  };
}
