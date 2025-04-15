import { createApiClient } from '@/api/core/apiClient';

export const useApiService = (entityPath, options = {}) => {
  const api = createApiClient(entityPath, options);

  const fetchAll = async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await api.get('', {
        params: { pageNumber, pageSize }
      });
      const { items, totalCount } = response.data;
      return { data: items, totalCount };
    } catch (error) {
      throw error;
    }
  };

  const getById = async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const create = async (data) => {
    try {
      const response = await api.post('', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const update = async (id, data) => {
    try {
      const response = await api.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const remove = async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    api,
    fetchAll,
    getById,
    create,
    update,
    remove
  };
};
