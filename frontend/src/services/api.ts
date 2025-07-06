import axios from 'axios';
import NetworkConfig from '@/lib/network-config';

// Create axios instance with dynamic base URL
const api = axios.create({
  baseURL: NetworkConfig.getApiBaseUrl(),
  // Don't set default Content-Type, let axios handle it per request
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Only set Content-Type for non-FormData requests
    if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      console.error('Network error - check if backend server is running and accessible');
      console.error(`Expected backend URL: ${NetworkConfig.getApiBaseUrl()}`);
      NetworkConfig.logNetworkInfo();
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData: any) => {
    try {
      console.log('Sending registration data:', userData instanceof FormData ? 'FormData object' : userData);
      console.log('userData constructor:', userData.constructor.name);
      
      // For FormData, don't set any headers - let axios handle it
      const config = userData instanceof FormData 
        ? { 
            headers: {
              // Don't set Content-Type, axios will set it with boundary
            }
          }
        : { 
            headers: { 
              'Content-Type': 'application/json' 
            } 
          };
      
      console.log('Request config:', config);
      
      const response = await api.post('/users/register', userData, config);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API register error:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  },
};

// Wallet API calls
export const walletAPI = {
  getWallet: async () => {
    const response = await api.get('/users/wallet');
    return response.data;
  },

  cashIn: async (amount, ewalletId) => {
    const response = await api.post('/users/wallet/cash-in', { amount, ewalletId });
    return response.data;
  },

  cashOut: async (amount, ewalletId) => {
    const response = await api.post('/users/wallet/cash-out', { amount, ewalletId });
    return response.data;
  },

  connectEwallet: async (accountData) => {
    const response = await api.post('/users/wallet/connect', accountData);
    return response.data;
  },

  disconnectEwallet: async (ewalletId) => {
    const response = await api.delete(`/users/wallet/disconnect/${ewalletId}`);
    return response.data;
  },

  createEwalletAccount: async (accountData) => {
    const response = await api.post('/users/wallet/create-account', accountData);
    return response.data;
  },

  getAvailableEwallets: async () => {
    const response = await api.get('/users/wallet/available-ewallets');
    return response.data;
  },

  getEwalletsByType: async (type) => {
    const response = await api.get(`/users/wallet/ewallets/${type}`);
    return response.data;
  },
};

// Products API calls
export const productsAPI = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getMyProducts: async () => {
    const response = await api.get('/products/my-products');
    return response.data;
  },

  getProductById: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (productId, productData) => {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  },

  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },
};

// Auth helper functions
export const auth = {
  // Save user data and token to localStorage
  saveUserData: (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  },

  // Get user data from localStorage
  getUserData: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  },
};

// Network connectivity test
export const testConnection = async () => {
  try {
    const response = await api.get('/health', { timeout: 5000 });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { 
      success: false, 
      error: error.message,
      baseUrl: NetworkConfig.getApiBaseUrl()
    };
  }
};

export default api;
