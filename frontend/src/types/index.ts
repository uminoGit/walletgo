export interface Transaction {
  _id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  createdAt: string;
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
