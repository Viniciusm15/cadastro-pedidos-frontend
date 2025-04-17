import { categoryService } from '@/api/categoryService';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/api/productService';
import { productSchema } from '@/schemas/productSchema';
import { useState, useEffect, useCallback } from 'react';

const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  categoryId: '',
  image: null
};

export function useProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});

  const resetForm = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
    setFormErrors({});
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([fetchProducts(1, 10), categoryService.fetchAll()]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        throw error;
      }
    };
    loadData();
  }, []);

  const handleOpenModal = useCallback(
    (type, rowData = null) => {
      setFormErrors({});

      if (type === 'create') {
        resetForm();
      } else if (rowData) {
        setFormState({
          ...INITIAL_FORM_STATE,
          ...rowData
        });
      }

      setModalType(type);
      setIsModalOpen(true);
    },
    [resetForm]
  );

  const handleCreate = useCallback(() => {
    resetForm();
    handleOpenModal('create');
  }, [handleOpenModal, resetForm]);

  const handleEdit = useCallback(() => {
    if (!selectedRowId) return;

    const selectedProduct = products.find((p) => p.productId === selectedRowId);
    if (selectedProduct) {
      handleOpenModal('edit', selectedProduct);
    }
  }, [selectedRowId, products, handleOpenModal]);

  const handleDelete = useCallback(async () => {
    if (!selectedRowId) return;

    try {
      await deleteProduct(selectedRowId);
      const { data } = await fetchProducts(1, 10);
      setProducts(data);
      setSelectedRowId(null);
    } catch (error) {
      throw error;
    }
  }, [selectedRowId]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedRowId(null);
    resetForm();
  }, [resetForm]);

  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setFormState((prev) => ({
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
        setFormState((prev) => ({
          ...prev,
          image: {
            description: file.name.replace(/\.[^/.]+$/, ''),
            imageMimeType: file.type,
            imageData: base64String
          }
        }));
      } catch (error) {
        throw error;
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        await productSchema.validate(formState, { abortEarly: false });
        setFormErrors({});

        if (modalType === 'create') {
          await createProduct(formState);
        } else if (modalType === 'edit') {
          await updateProduct(selectedRowId, formState);
        }

        const { data } = await fetchProducts(1, 10);
        setProducts(data);
        handleCloseModal();
      } catch (err) {
        if (err.name === 'ValidationError') {
          const errors = {};
          err.inner.forEach(({ path, message }) => {
            errors[path] = message;
          });
          setFormErrors(errors);
        }
      }
    },
    [formState, modalType, selectedRowId, handleCloseModal]
  );

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
    handleSubmit
  };
}
