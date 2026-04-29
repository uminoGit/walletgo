import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { formatCurrency, formatDate } from '../utils/format';
import { BUSINESS_EXPENSE_CATEGORIES } from '../types';

const BusinessDashboard: React.FC = () => {
  const { summary, cortes, loading, registrarVenta, registrarGasto, hacerCorte } = useBusiness();
  const [ventaAmount, setVentaAmount] = useState('');
  const [ventaDesc, setVentaDesc] = useState('');
  const [gastoAmount, setGastoAmount] = useState('');
  const [gastoDesc, setGastoDesc] = useState('');
  const [gastoCategory, setGastoCategory] = useState('');
  const [nota, setNota] = useState('');
  const [submittingVenta, setSubmittingVenta] = useState(false);
  const [submittingGasto, setSubmittingGasto] = useState(false);
  const [submittingCorte, setSubmittingCorte] = useState(false);
  const [showCorteConfirm, setShowCorteConfirm] = useState(false);
  const [tab, setTab] = useState<'ventas' | 'gastos' | 'cortes'>('ventas');
  const [ventaError, setVentaError] = useState('');
  const [gastoError, setGastoError] = useState('');

  const handleVenta = async () => {
    const amount = parseFloat(ventaAmount);
    if (!ventaAmount || isNaN(amount) || amount <= 0) {
      setVentaError('Ingresa un monto válido');
      return;
    }
    setVentaError('');
    setSubmittingVenta(true);
    try {
      await registrarVenta(amount, ventaDesc || undefined);
      setVentaAmount('');
      setVentaDesc('');
    } catch {}
    finally { setSubmittingVenta(false); }
  };

  const handleGasto = async () => {
    const amount = parseFloat(gastoAmount);
    if (!gastoAmount || isNaN(amount) || amount <= 0) {
      setGastoError('Ingresa un monto válido');
      return;
    }
    if (!gastoDesc.trim()) {
      setGastoError('Agrega una descripción');
      return;
    }
    setGastoError('');
    setSubmittingGasto(true);
    try {
      await registrarGasto(amount, gastoDesc, gastoCategory || 'Gasto negocio');
      setGastoAmount('');
      setGastoDesc('');
      setGastoCategory('');
    } catch {}
    finally { setSubmittingGasto(false); }
  };

  const handleCorte = async () => {
    setSubmittingCorte(true);
    try {
      await hacerCorte(nota || undefined);
      setNota('');
      setShowCorteConfirm(false);
    } catch {}
    finally { setSubmittingCorte(false); }
  };

  if (loading) return <div className="card loading-card">Cargando datos del negocio...</div>;

  return (
    <section className="business-section">
      <p className="section-subtitle">{summary?.fecha}</p>

      <div className="stats-grid">
        <div className="stat-card income">
          <span className="stat-label">Ventas del día</span>
          <span className="stat-value income-value">
            {formatCurrency(summary?.totalVentas || 0)}
          </span>
          <span className="stat-indicator">↑</span>
        </div>
        <div className="stat-card expenses">
          <span className="stat-label">Gastos del día</span>
          <span className="stat-value expense-value">
            {formatCurrency(summary?.totalGastos || 0)}
          </span>
          <span className="stat-indicator">↓</span>
        </div>
        <div className={`stat-card balance ${(summary?.ganancia || 0) >= 0 ? 'positive' : 'negative'}`}>
          <span className="stat-label">Ganancia neta</span>
          <span className="stat-value">
            {formatCurrency(summary?.ganancia || 0)}
          </span>
          <span className="stat-indicator">{(summary?.ganancia || 0) >= 0 ? '↑' : '↓'}</span>
        </div>
      </div>

      <div className="business-tabs">
        {(['ventas', 'gastos', 'cortes'] as const).map((t) => (
          <button
            key={t}
            className={`filter-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'ventas' ? '💰 Registrar venta' : t === 'gastos' ? '📦 Registrar gasto' : '📋 Cortes'}
          </button>
        ))}
      </div>

      {tab === 'ventas' && (
        <div className="business-form-card">
          <h3 className="chart-title">Nueva venta</h3>
          <div className="form-group">
            <label>Monto recibido (MXN)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={ventaAmount}
              onChange={(e) => { setVentaAmount(e.target.value); setVentaError(''); }}
              className={ventaError ? 'input-error' : ''}
            />
          </div>
          <div className="form-group">
            <label>¿Qué vendiste? (opcional)</label>
            <input
              type="text"
              placeholder="Ej: Refresco, pan, leche..."
              value={ventaDesc}
              onChange={(e) => setVentaDesc(e.target.value)}
              maxLength={200}
            />
          </div>
          {ventaError && <span className="field-error">{ventaError}</span>}
          <button
            className="submit-btn venta-btn"
            onClick={handleVenta}
            disabled={submittingVenta}
          >
            {submittingVenta ? 'Registrando...' : '+ Registrar venta'}
          </button>

          {(summary?.transacciones.filter(t => t.type === 'income') || []).length > 0 && (
            <div className="business-list">
              <p className="business-list-title">Ventas de hoy</p>
              {summary?.transacciones
                .filter(t => t.type === 'income')
                .map((t) => (
                  <div key={t._id} className="business-list-item income">
                    <span>{t.description}</span>
                    <span className="income-value">+{formatCurrency(t.amount)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {tab === 'gastos' && (
        <div className="business-form-card">
          <h3 className="chart-title">Nuevo gasto</h3>
          <div className="form-group">
            <label>Monto (MXN)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={gastoAmount}
              onChange={(e) => { setGastoAmount(e.target.value); setGastoError(''); }}
              className={gastoError ? 'input-error' : ''}
            />
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select
              value={gastoCategory}
              onChange={(e) => setGastoCategory(e.target.value)}
            >
              <option value="">Selecciona categoría</option>
              {BUSINESS_EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <input
              type="text"
              placeholder="Ej: Compra de refresco al mayoreo"
              value={gastoDesc}
              onChange={(e) => { setGastoDesc(e.target.value); setGastoError(''); }}
              maxLength={200}
            />
          </div>
          {gastoError && <span className="field-error">{gastoError}</span>}
          <button
            className="submit-btn"
            onClick={handleGasto}
            disabled={submittingGasto}
          >
            {submittingGasto ? 'Registrando...' : '+ Registrar gasto'}
          </button>

          {(summary?.transacciones.filter(t => t.type === 'expense') || []).length > 0 && (
            <div className="business-list">
              <p className="business-list-title">Gastos de hoy</p>
              {summary?.transacciones
                .filter(t => t.type === 'expense')
                .map((t) => (
                  <div key={t._id} className="business-list-item expense">
                    <span>{t.description}</span>
                    <span className="expense-value">−{formatCurrency(t.amount)}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {tab === 'cortes' && (
        <div className="business-form-card">
          <h3 className="chart-title">Corte de caja</h3>

          {!showCorteConfirm ? (
            <>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
                El corte guarda un resumen del día con las ventas, gastos y ganancia actual.
              </p>
              <button
                className="submit-btn"
                onClick={() => setShowCorteConfirm(true)}
              >
                Hacer corte del día
              </button>
            </>
          ) : (
            <>
              <div className="corte-preview">
                <div className="budget-status-row">
                  <span>Ventas:</span>
                  <strong className="text-ok">{formatCurrency(summary?.totalVentas || 0)}</strong>
                </div>
                <div className="budget-status-row">
                  <span>Gastos:</span>
                  <strong className="text-danger">{formatCurrency(summary?.totalGastos || 0)}</strong>
                </div>
                <div className="budget-status-row">
                  <span>Ganancia:</span>
                  <strong>{formatCurrency(summary?.ganancia || 0)}</strong>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 16 }}>
                <label>Nota (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Día de quincena, mucha venta"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  maxLength={200}
                />
              </div>
              <div className="modal-actions" style={{ marginTop: 16 }}>
                <button className="cancel-btn" onClick={() => setShowCorteConfirm(false)}>
                  Cancelar
                </button>
                <button
                  className="submit-btn"
                  onClick={handleCorte}
                  disabled={submittingCorte}
                >
                  {submittingCorte ? 'Guardando...' : 'Confirmar corte'}
                </button>
              </div>
            </>
          )}

          {cortes.length > 0 && (
            <div className="business-list" style={{ marginTop: 24 }}>
              <p className="business-list-title">Cortes recientes</p>
              {cortes.map((c) => (
                <div key={c._id} className="corte-item">
                  <div className="corte-date">{formatDate(c.date)}</div>
                  <div className="corte-row">
                    <span>Ventas</span>
                    <span className="income-value">{formatCurrency(c.totalVentas)}</span>
                  </div>
                  <div className="corte-row">
                    <span>Gastos</span>
                    <span className="expense-value">{formatCurrency(c.totalGastos)}</span>
                  </div>
                  <div className="corte-row">
                    <span>Ganancia</span>
                    <strong>{formatCurrency(c.ganancia)}</strong>
                  </div>
                  {c.nota && <div className="corte-nota">📝 {c.nota}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default BusinessDashboard;