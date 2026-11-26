import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

apiClient.interceptors.request.use((config) =>{
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const publicRoutes = ["/", "/login", "/signup"];
        const currentPath = window.location.pathname;
        if (status === 401) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            if (!publicRoutes.includes(currentPath)) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;