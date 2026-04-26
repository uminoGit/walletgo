import React from 'react';
import { useWallet } from '../context/WalletContext';
import { formatCurrency } from '../utils/format';
import CategoryChart from './CategoryChart';

const Dashboard: React.FC = () => {
  const { summary, budget, loading, transactions } = useWallet();

  if (loading) return <div className="card loading-card">Cargando resumen...</div>;
  if (!summary) return null;

  const budgetUsed = budget ? (summary.totalExpenses / budget.monthlyLimit) * 100 : 0;
  const budgetExceeded = budget ? summary.totalExpenses > budget.monthlyLimit : false;

  return (
    <section className="dashboard">
      <h2 className="section-title">Resumen del Mes</h2>
      <p className="section-subtitle">{summary.month}</p>

      <div className="stats-grid">
        <div className={`stat-card balance ${summary.balance >= 0 ? 'positive' : 'negative'}`}>
          <span className="stat-label">Balance Total</span>
          <span className="stat-value">{formatCurrency(summary.balance)}</span>
          <span className="stat-indicator">{summary.balance >= 0 ? '↑' : '↓'}</span>
        </div>

        <div className="stat-card income">
          <span className="stat-label">Ingresos</span>
          <span className="stat-value income-value">{formatCurrency(summary.totalIncome)}</span>
          <span className="stat-indicator income-icon">+</span>
        </div>

        <div className="stat-card expenses">
          <span className="stat-label">Gastos</span>
          <span className="stat-value expense-value">{formatCurrency(summary.totalExpenses)}</span>
          <span className="stat-indicator expense-icon">−</span>
        </div>
      </div>

      {budget && (
        <div className={`budget-bar-card ${budgetExceeded ? 'exceeded' : ''}`}>
          <div className="budget-bar-header">
            <span className="budget-bar-label">Presupuesto mensual</span>
            <span className="budget-bar-amounts">
              {formatCurrency(summary.totalExpenses)} / {formatCurrency(budget.monthlyLimit)}
            </span>
          </div>
          <div className="progress-track">
            <div
              className={`progress-fill ${budgetExceeded ? 'over' : ''}`}
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            />
          </div>
          {budgetExceeded && (
            <p className="budget-alert">
              ⚠️ Superaste tu presupuesto en{' '}
              {formatCurrency(summary.totalExpenses - budget.monthlyLimit)}
            </p>
          )}
          {!budgetExceeded && (
            <p className="budget-remaining">
              Te quedan {formatCurrency(budget.monthlyLimit - summary.totalExpenses)} de presupuesto
            </p>
          )}
        </div>
      )}

      <CategoryChart transactions={transactions} />
    </section>
  );
};

export default Dashboard;