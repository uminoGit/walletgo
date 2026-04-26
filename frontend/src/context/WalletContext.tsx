import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Transaction, Summary, Budget, TransactionFormData } from '../types';
import { transactionApi, budgetApi } from '../utils/api';

interface WalletContextType {
  transactions: Transaction[];
  summary: Summary | null;
  budget: Budget | null;
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  addTransaction: (data: TransactionFormData) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  editTransaction: (id: string, data: TransactionFormData) => Promise<void>;
  saveBudget: (limit: number) => Promise<void>;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [txs, sum, bud] = await Promise.all([
        transactionApi.getAll(),
        transactionApi.getSummary(),
        budgetApi.get(),
      ]);
      setTransactions(txs);
      setSummary(sum);
      setBudget(bud);
    } catch {
      setError('Error al cargar los datos. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = async (data: TransactionFormData) => {
    setError(null);
    try {
      const tx = await transactionApi.create(data);
      setTransactions((prev) => [tx, ...prev]);
      const sum = await transactionApi.getSummary();
      setSummary(sum);
    } catch {
      setError('Error al crear la transacción.');
      throw new Error('Failed to create transaction');
    }
  };

  const removeTransaction = async (id: string) => {
    setError(null);
    try {
      await transactionApi.delete(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      const sum = await transactionApi.getSummary();
      setSummary(sum);
    } catch {
      setError('Error al eliminar la transacción.');
    }
  };

  const editTransaction = async (id: string, data: TransactionFormData) => {
    setError(null);
    try {
      const updated = await transactionApi.update(id, data);
      setTransactions((prev) => prev.map((t) => (t._id === id ? updated : t)));
      const sum = await transactionApi.getSummary();
      setSummary(sum);
    } catch {
      setError('Error al editar la transacción.');
      throw new Error('Failed to edit transaction');
    }
  };

  const saveBudget = async (limit: number) => {
    setError(null);
    try {
      const bud = await budgetApi.set(limit);
      setBudget(bud);
    } catch {
      setError('Error al guardar el presupuesto.');
      throw new Error('Failed to save budget');
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <WalletContext.Provider
      value={{
        transactions,
        summary,
        budget,
        loading,
        error,
        fetchAll,
        addTransaction,
        removeTransaction,
        editTransaction,
        saveBudget,
        clearError,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
};