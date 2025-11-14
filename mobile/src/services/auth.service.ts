import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthResponse } from '../types';

export const authService = {
  // 회원가입
  async register(data: {
    email: string;
    password: string;
    name: string;
    phoneNumber?: string;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // 로그인
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // 로그아웃
  async logout(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  // 프로필 조회
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  // 저장된 사용자 정보 가져오기
  async getStoredUser(): Promise<User | null> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 저장된 토큰 가져오기
  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  },
};
