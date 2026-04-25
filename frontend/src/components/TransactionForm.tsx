import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { TransactionFormData, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types';
import { getTodayISO } from '../utils/format';

const emptyForm = (): TransactionFormData => ({
  amount: '',
  type: 'expense',
  category: '',
  description: '',
  date: getTodayISO(),
});

const TransactionForm: React.FC = () => {
  const { addTransaction } = useWallet();
  const [form, setForm] = useState<TransactionFormData>(emptyForm());
  const [errors, setErrors] = useState<Partial<TransactionFormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {};
    const amt = parseFloat(form.amount);

    if (!form.amount || isNaN(amt) || amt <= 0) {
      newErrors.amount = 'Ingresa un monto válido mayor a 0';
    }
    if (!form.category) {
      newErrors.category = 'Selecciona una categoría';
    }
    if (!form.description.trim()) {
      newErrors.description = 'Agrega una descripción';
    }
    if (form.description.trim().length > 200) {
      newErrors.description = 'Máximo 200 caracteres';
    }
    if (!form.date) {
      newErrors.date = 'Selecciona una fecha';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: '' } : {}),
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await addTransaction(form);
      setForm(emptyForm());
      setErrors({});
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      // error handled in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-section">
      <h2 className="section-title">Nueva Transacción</h2>

      {success && <div className="success-banner">✓ Transacción registrada correctamente</div>}

      <form className="transaction-form" onSubmit={handleSubmit} noValidate>
        <div className="type-toggle">
          <button
            type="button"
            className={`toggle-btn ${form.type === 'expense' ? 'active expense' : ''}`}
            onClick={() => setForm((p) => ({ ...p, type: 'expense', category: '' }))}
          >
            Gasto
          </button>
          <button
            type="button"
            className={`toggle-btn ${form.type === 'income' ? 'active income' : ''}`}
            onClick={() => setForm((p) => ({ ...p, type: 'income', category: '' }))}
          >
            Ingreso
          </button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Monto (MXN)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              className={errors.amount ? 'input-error' : ''}
            />
            {errors.amount && <span className="field-error">{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Fecha</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className={errors.date ? 'input-error' : ''}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={errors.category ? 'input-error' : ''}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="¿En qué gastaste o cuánto recibiste?"
            value={form.description}
            onChange={handleChange}
            maxLength={200}
            className={errors.description ? 'input-error' : ''}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Guardando...' : '+ Agregar transacción'}
        </button>
      </form>
    </section>
  );
};

export default TransactionForm;
