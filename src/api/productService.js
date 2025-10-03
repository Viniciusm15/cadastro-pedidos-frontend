import { createApiClient } from '@/api/core/apiClient';

const api = createApiClient('Product');

export const fetchProducts = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await api.get('', {
      params: {
        pageNumber: pageNumber,
        pageSize: pageSize
      }
    });

    const { items, totalCount } = response.data;
    return { data: items, totalCount };
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (data) => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('stockQuantity', data.stockQuantity);
    formData.append('categoryId', data.categoryId);

    if (data.image) {
      formData.append('Image.Description', data.image.description);
      formData.append('Image.ImageMimeType', data.image.imageMimeType);
      formData.append('Image.ImageData', data.image.imageData);
    }

    const response = await api.post('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateProduct = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('stockQuantity', data.stockQuantity);
    formData.append('categoryId', data.categoryId);

    if (data.image) {
      formData.append('Image.Description', data.image.description);
      formData.append('Image.ImageMimeType', data.image.imageMimeType);
      formData.append('Image.ImageData', data.image.imageData);
    }

    const response = await api.put(`/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
