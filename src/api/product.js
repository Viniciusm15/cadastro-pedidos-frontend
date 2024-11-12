import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_BACK_END_URL;

export const fetchProducts = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${apiUrl}/api/Product`, {
      params: { pageNumber, pageSize },
    });

    const { items, totalCount } = response.data;
    return { data: items, totalCount };
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/api/Product/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (data) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stockQuantity", data.stockQuantity);
    formData.append("categoryId", data.categoryId);

    if (data.image) {
      formData.append("Image.Description", data.image.description);
      formData.append("Image.ImageMimeType", data.image.imageMimeType);
      formData.append("Image.ImageData", data.image.imageData);
    }

    await axios.post(`${apiUrl}/api/Product`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  try {
    await axios.put(`${apiUrl}/api/Product/${id}`, data);
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${apiUrl}/api/Product/${id}`);
  } catch (error) {
    throw error;
  }
};
