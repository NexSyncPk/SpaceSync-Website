import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import config from "@/config";
import { getToken } from "@/utils/helpers";
import { routes } from "@/utils/constants";
import toast from "react-hot-toast";

// Dispatch function for Redux integration
let dispatch: any = null;

// Initialize interceptor with Redux store
export const initializeInterceptor = (dispatchInstance: any) => {
  dispatch = dispatchInstance;
};

const api = axios.create({
  baseURL: config.SERVER_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.method === "post") {
      toast.success(response?.data.message || "Your request was successful.");
    }
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data }: { status: number; data: any } = error.response;
      
      if (error?.config && error?.config?.method === "post") {
        toast.error(data?.message || "An error occurred. Please try again.");
      }

      if (status === 401) {
        // Use Redux logout instead of localStorage
        if (dispatch) {
          dispatch({ type: 'auth/logout' });
        }
        // window.location.href = routes.login;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
