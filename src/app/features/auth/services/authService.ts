import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import { MOCK_ENABLED } from '@/app/lib/mock';
import type { LoginPayload, RegisterPayload, AuthResponse, MessageResponse } from '../types';

function buildMockResponse(): AuthResponse {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: 'mock-user-001', exp: Math.floor(Date.now() / 1000) + 31536000 }));
  return {
    access_token: `${header}.${payload}.mock-signature`,
    refresh_token: 'mock-refresh-token',
    user: { id: 'mock-user-001', name: 'Phillipe Diaz', email: 'test@nondecants.com', role: 'CLIENT', isEmailVerified: true },
  };
}

function mapBackendAuthResponse(backendData: any): AuthResponse {
  return {
    access_token: backendData.accessToken,
    refresh_token: '',
    user: {
      id: String(backendData.user.id),
      name: `${backendData.user.firstName} ${backendData.user.lastName}`.trim(),
      email: backendData.user.email,
      role: backendData.user.role as 'ADMIN' | 'CLIENT',
      isEmailVerified: backendData.user.isEmailVerified ?? false,
    },
  };
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    if (MOCK_ENABLED) {
      if (payload.email === 'test@nondecants.com' && payload.password === '123456') {
        return buildMockResponse();
      }
      throw new Error('Credenciales incorrectas');
    }
    const { data } = await axiosInstance.post(API_ENDPOINTS.LOGIN, payload);
    return mapBackendAuthResponse(data?.data ?? data);
  },

  register: async (payload: RegisterPayload): Promise<MessageResponse> => {
    if (MOCK_ENABLED) {
      return { message: 'Registro exitoso. Revisa tu email.' };
    }

    const body = {
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
    console.log('[DEBUG register] URL:', API_ENDPOINTS.REGISTER, 'body:', body);

    try {
      const { data } = await axiosInstance.post(API_ENDPOINTS.REGISTER, body);
      console.log('[DEBUG register] response:', data);
      return data?.data ?? data;
    } catch (err: any) {
      console.error('[DEBUG register] error:', err?.response?.status, err?.response?.data, err?.message);
      throw err;
    }
  },

  logout: async (): Promise<void> => {
    // Backend doesn't have logout endpoint - just clear localStorage
  },

  forgotPassword: async (email: string): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
  },

  verifyEmail: async (token: string): Promise<MessageResponse> => {
    const { data } = await axiosInstance.get(`${API_ENDPOINTS.VERIFY_EMAIL}?token=${token}`);
    return data?.data ?? data;
  },

  resendVerification: async (email: string): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.RESEND_VERIFICATION, { email });
  },

  googleAuth: async (idToken: string): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.GOOGLE_AUTH, { idToken });
    return mapBackendAuthResponse(data?.data ?? data);
  },
};
