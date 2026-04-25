import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatCurrency } from '../utils/format';

const BudgetPanel: React.FC = () => {
  const { budget, summary, saveBudget } = useWallet();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (budget) setInputValue(String(budget.monthlyLimit));
  }, [budget]);

  const handleSave = async () => {
    const limit = parseFloat(inputValue);
    if (!inputValue || isNaN(limit) || limit <= 0) {
      setError('Ingresa un límite mayor a 0');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await saveBudget(limit);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Error al guardar el presupuesto');
    } finally {
      setSaving(false);
    }
  };

  const budgetExceeded =
    budget && summary ? summary.totalExpenses > budget.monthlyLimit : false;

  return (
    <section className="budget-section">
      <h2 className="section-title">Presupuesto Mensual</h2>

      <div className="budget-form">
        <div className="form-group">
          <label htmlFor="budget-input">Límite de gasto mensual (MXN)</label>
          <div className="budget-input-row">
            <input
              id="budget-input"
              type="number"
              min="1"
              step="1"
              placeholder="Ej: 5000"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError('');
              }}
              className={error ? 'input-error' : ''}
            />
            <button className="save-budget-btn" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar'}
            </button>
          </div>
          {error && <span className="field-error">{error}</span>}
        </div>
      </div>

      {budget && summary && (
        <div className={`budget-status ${budgetExceeded ? 'status-over' : 'status-ok'}`}>
          <div className="budget-status-row">
            <span>Límite:</span>
            <strong>{formatCurrency(budget.monthlyLimit)}</strong>
          </div>
          <div className="budget-status-row">
            <span>Gastado este mes:</span>
            <strong className={budgetExceeded ? 'text-danger' : 'text-ok'}>
              {formatCurrency(summary.totalExpenses)}
            </strong>
          </div>
          <div className="budget-status-row">
            <span>{budgetExceeded ? 'Excediste en:' : 'Disponible:'}</span>
            <strong className={budgetExceeded ? 'text-danger' : 'text-ok'}>
              {formatCurrency(Math.abs(budget.monthlyLimit - summary.totalExpenses))}
            </strong>
          </div>

          {budgetExceeded && (
            <div className="alert-box">
              ⚠️ Has superado tu presupuesto mensual. Revisa tus gastos.
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default BudgetPanel;
