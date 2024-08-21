import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_BACK_END_URL;

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/Category`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCategory = async (data) => {
  try {
    await axios.post(`${apiUrl}/api/Category`, data);
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    await axios.put(`${apiUrl}/api/Category/${id}`, data);
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    await axios.delete(`${apiUrl}/api/Category/${id}`);
  } catch (error) {
    throw error;
  }
};
