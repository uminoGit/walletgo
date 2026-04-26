import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/format';
import EditModal from './EditModal';

const TransactionList: React.FC = () => {
  const { transactions, removeTransaction, loading } = useWallet();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [editing, setEditing] = useState<Transaction | null>(null);

  const filtered = transactions.filter((t) => filter === 'all' || t.type === filter);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await removeTransaction(id);
    setDeletingId(null);
  };

  return (
    <section className="list-section">
      <div className="list-header">
        <h2 className="section-title">Transacciones</h2>
        <div className="filter-tabs">
          {(['all', 'income', 'expense'] as const).map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Todas' : f === 'income' ? 'Ingresos' : 'Gastos'}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="empty-state">Cargando...</p>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>No hay transacciones que mostrar.</p>
        </div>
      )}

      <ul className="transaction-list">
        {filtered.map((tx) => (
          <li key={tx._id} className={`transaction-item ${tx.type}`}>
            <div className="tx-icon">{tx.type === 'income' ? '↑' : '↓'}</div>
            <div className="tx-info">
              <span className="tx-description">{tx.description}</span>
              <span className="tx-meta">
                {tx.category} · {formatDate(tx.date)}
              </span>
            </div>
            <div className="tx-right">
              <span className={`tx-amount ${tx.type}`}>
                {tx.type === 'income' ? '+' : '−'} {formatCurrency(tx.amount)}
              </span>
              <button
                className="edit-btn"
                onClick={() => setEditing(tx)}
                aria-label="Editar transacción"
              >
                ✎
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(tx._id)}
                disabled={deletingId === tx._id}
                aria-label="Eliminar transacción"
              >
                {deletingId === tx._id ? '...' : '✕'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <EditModal transaction={editing} onClose={() => setEditing(null)} />
      )}
    </section>
  );
};

export default TransactionList;