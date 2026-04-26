import React, { useState, useEffect } from 'react';
import { Transaction, TransactionFormData, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types';
import { useWallet } from '../context/WalletContext';

interface Props {
  transaction: Transaction;
  onClose: () => void;
}

const EditModal: React.FC<Props> = ({ transaction, onClose }) => {
  const { editTransaction } = useWallet();
  const [form, setForm] = useState<TransactionFormData>({
    amount: String(transaction.amount),
    type: transaction.type,
    category: transaction.category,
    description: transaction.description,
    date: transaction.date.split('T')[0],
  });
  const [errors, setErrors] = useState<Partial<TransactionFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const validate = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {};
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) newErrors.amount = 'Monto válido requerido';
    if (!form.category) newErrors.category = 'Selecciona una categoría';
    if (!form.description.trim()) newErrors.description = 'Agrega una descripción';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      await editTransaction(transaction._id, form);
      onClose();
    } catch {
      // error handled in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Editar transacción</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
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
              <label htmlFor="edit-amount">Monto (MXN)</label>
              <input
                id="edit-amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                className={errors.amount ? 'input-error' : ''}
              />
              {errors.amount && <span className="field-error">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="edit-date">Fecha</label>
              <input
                id="edit-date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-category">Categoría</label>
            <select
              id="edit-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={errors.category ? 'input-error' : ''}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className="field-error">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edit-description">Descripción</label>
            <input
              id="edit-description"
              name="description"
              type="text"
              value={form.description}
              onChange={handleChange}
              maxLength={200}
              className={errors.description ? 'input-error' : ''}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;