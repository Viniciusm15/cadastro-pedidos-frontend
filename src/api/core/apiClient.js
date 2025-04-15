import axios from 'axios';

export const createApiClient = (entityPath, extraConfig = {}) => {
  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACK_END_URL}/api/${entityPath}`,
    ...extraConfig
  });
};
