export interface Transaction {
  _id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  createdAt: string;
  source: 'personal' | 'business';
}

export interface TransactionFormData {
  amount: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

export interface Summary {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  month: string;
}

export interface Budget {
  _id?: string;
  monthlyLimit: number;
}

export interface BusinessSummary {
  totalVentas: number;
  totalGastos: number;
  ganancia: number;
  transacciones: Transaction[];
  cortesRecientes: Corte[];
  fecha: string;
}

export interface Corte {
  _id: string;
  date: string;
  totalVentas: number;
  totalGastos: number;
  ganancia: number;
  nota?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  mode: 'personal' | 'business';
  businessName?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const INCOME_CATEGORIES = [
  'Salario',
  'Beca',
  'Freelance',
  'Regalo',
  'Inversión',
  'Otro ingreso',
] as const;

export const EXPENSE_CATEGORIES = [
  'Alimentación',
  'Transporte',
  'Educación',
  'Entretenimiento',
  'Salud',
  'Ropa',
  'Tecnología',
  'Servicios',
  'Otro gasto',
] as const;

export const BUSINESS_EXPENSE_CATEGORIES = [
  'Compras de mercancía',
  'Servicios (luz, agua, gas)',
  'Renta',
  'Transporte',
  'Mantenimiento',
  'Otro gasto negocio',
] as const;