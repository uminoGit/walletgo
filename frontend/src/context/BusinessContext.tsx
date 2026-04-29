import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { BusinessSummary, Corte } from '../types';
import { businessApi } from '../utils/api';

interface BusinessContextType {
  summary: BusinessSummary | null;
  cortes: Corte[];
  loading: boolean;
  error: string | null;
  fetchSummary: () => Promise<void>;
  registrarVenta: (amount: number, description?: string) => Promise<void>;
  registrarGasto: (amount: number, description: string, category: string) => Promise<void>;
  hacerCorte: (nota?: string) => Promise<void>;
  clearError: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [summary, setSummary] = useState<BusinessSummary | null>(null);
  const [cortes, setCortes] = useState<Corte[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sum, corts] = await Promise.all([
        businessApi.getSummary(),
        businessApi.getCortes(),
      ]);
      setSummary(sum);
      setCortes(corts);
    } catch {
      setError('Error al cargar los datos del negocio.');
    } finally {
      setLoading(false);
    }
  }, []);

  const registrarVenta = async (amount: number, description?: string) => {
    setError(null);
    try {
      await businessApi.registrarVenta(amount, description);
      await fetchSummary();
    } catch {
      setError('Error al registrar la venta.');
      throw new Error('Failed');
    }
  };

  const registrarGasto = async (amount: number, description: string, category: string) => {
    setError(null);
    try {
      await businessApi.registrarGasto(amount, description, category);
      await fetchSummary();
    } catch {
      setError('Error al registrar el gasto.');
      throw new Error('Failed');
    }
  };

  const hacerCorte = async (nota?: string) => {
    setError(null);
    try {
      const corte = await businessApi.hacerCorte(nota);
      setCortes((prev) => [corte, ...prev]);
      await fetchSummary();
    } catch {
      setError('Error al hacer el corte.');
      throw new Error('Failed');
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <BusinessContext.Provider
      value={{
        summary,
        cortes,
        loading,
        error,
        fetchSummary,
        registrarVenta,
        registrarGasto,
        hacerCorte,
        clearError,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = (): BusinessContextType => {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusiness must be used within BusinessProvider');
  return ctx;
};