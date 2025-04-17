import { categoryService } from '@/api/categoryService';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/api/productService';
import { productSchema } from '@/schemas/productSchema';
import { useState, useEffect } from 'react';

export function useProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    categoryId: '',
    image: null
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProducts(1, 10).then(({ data }) => setProducts(data));
    categoryService.fetchAll().then(({ data }) => setCategories(data));
  }, []);

  const handleOpenModal = (
    type,
    row = {
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      categoryId: '',
      image: null
    }
  ) => {
    setFormState(row);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCreate = () => handleOpenModal('create');

  const handleEdit = () => {
    if (selectedRowId) {
      const selectedRow = products.find(({ productId }) => productId === selectedRowId);
      if (selectedRow) {
        handleOpenModal('edit', selectedRow);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedRowId) {
      await deleteProduct(selectedRowId);
      fetchProducts(1, 10).then(({ data }) => {
        setProducts(data);
        setSelectedRowId(null);
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRowId(null);
    setFormState({
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      categoryId: '',
      image: null
    });
  };

  const handleInputChange = ({ target: { name, value } }) => setFormState((prev) => ({ ...prev, [name]: value }));

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];

      setFormState((prev) => ({
        ...prev,
        image: {
          description: file.name.replace(/\.[^/.]+$/, ''),
          imageMimeType: file.type,
          imageData: base64String
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await productSchema.validate(formState, { abortEarly: false });
      setFormErrors({});

      if (modalType === 'create') {
        await createProduct(formState);
      } else if (modalType === 'edit') {
        await updateProduct(selectedRowId, formState);
      }

      setIsModalOpen(false);
      fetchProducts(1, 10).then(({ data }) => setProducts(data));
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = {};
        err.inner.forEach((validationError) => {
          errors[validationError.path] = validationError.message;
        });
        setFormErrors(errors);
      }
    }
  };

  return {
    products,
    categories,
    isModalOpen,
    modalType,
    selectedRowId,
    formState,
    setSelectedRowId,
    handleOpenModal,
    handleCreate,
    handleEdit,
    handleDelete,
    handleCloseModal,
    handleInputChange,
    handleFileUpload,
    handleSubmit,
    formErrors
  };
}
