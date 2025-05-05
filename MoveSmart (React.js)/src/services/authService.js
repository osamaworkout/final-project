import axios from 'axios';

const authAPI = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(nationalNo, password) {
    try {
      const response = await authAPI.post('/User/login', {
        nationalNo,
        password
      });

      this.setSession(response.data);

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return this.handleAuthError(error);
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },

  setSession(authData) {
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        role: authData.role,
        userId: authData.userId,
        name: authData.name
      })
    );
  },

  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  handleAuthError(error) {
    let errorMessage = 'فشل تسجيل الدخول';

    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = 'بيانات غير صالحة';
          break;
        case 401:
          errorMessage = 'الرقم القومي أو كلمة المرور غير صحيحة';
          break;
        case 403:
          errorMessage = 'غير مصرح بالدخول';
          break;
        case 500:
          errorMessage = 'خطأ في الخادم الداخلي';
          break;
        default:
          errorMessage = error.response.data?.message || errorMessage;
      }
    } else if (error.request) {
      errorMessage = 'لا يوجد اتصال بالخادم';
    }

    return {
      success: false,
      error: errorMessage
    };
  },

  getAuthHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    };
  }
};
