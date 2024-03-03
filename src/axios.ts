import axios from "axios";

const baseURL = "https://clinic.universal-hub.site/";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await axios.put(baseURL + "auth/refresh_token", null, {
        withCredentials: true,
      });
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
