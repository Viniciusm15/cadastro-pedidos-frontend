import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_BACK_END_URL;

export const fetchClients = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${apiUrl}/api/Client`, {
      params: { pageNumber, pageSize },
    });
    
    const { items, totalCount } = response.data;
    return { data: items, totalCount };
  } catch (error) {
    throw error;
  }
};

export const getClientById = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/api/Client/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createClient = async (clientData) => {
  try {
    const response = await axios.post(`${apiUrl}/api/Client`, clientData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateClient = async (id, clientData) => {
  try {
    await axios.put(`${apiUrl}/api/Client/${id}`, clientData);
  } catch (error) {
    throw error;
  }
};

export const deleteClient = async (id) => {
  try {
    await axios.delete(`${apiUrl}/api/Clients/${id}`);
  } catch (error) {
    throw error;
  }
};
