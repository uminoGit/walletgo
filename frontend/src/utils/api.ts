import axios from 'axios';
import {
  Transaction,
  TransactionFormData,
  Summary,
  Budget,
  ApiResponse,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('wg_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const transactionApi = {
  getAll: async (): Promise<Transaction[]> => {
    const { data } = await api.get<ApiResponse<Transaction[]>>('/transactions');
    return data.data;
  },

  create: async (payload: TransactionFormData): Promise<Transaction> => {
    const { data } = await api.post<ApiResponse<Transaction>>('/transactions', {
      ...payload,
      amount: parseFloat(payload.amount),
    });
    return data.data;
  },

  update: async (id: string, payload: Partial<TransactionFormData>): Promise<Transaction> => {
    const body: Record<string, unknown> = { ...payload };
    if (payload.amount) body.amount = parseFloat(payload.amount);
    const { data } = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, body);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

  getSummary: async (): Promise<Summary> => {
    const { data } = await api.get<ApiResponse<Summary>>('/transactions/summary');
    return data.data;
  },
};

export const budgetApi = {
  get: async (): Promise<Budget | null> => {
    const { data } = await api.get<ApiResponse<Budget | null>>('/budget');
    return data.data;
  },

  set: async (monthlyLimit: number): Promise<Budget> => {
    const { data } = await api.post<ApiResponse<Budget>>('/budget', { monthlyLimit });
    return data.data;
  },
};