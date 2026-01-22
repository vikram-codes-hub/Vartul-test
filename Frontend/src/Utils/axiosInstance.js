import axios from "axios";

const axiosInstance = axios.create({
  // 🔥 IMPORTANT: baseURL includes /api/auth
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // backend expects token directly (not Bearer)
      config.headers.token = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // redirect to auth (not /login)
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
