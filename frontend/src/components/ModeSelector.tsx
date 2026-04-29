import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { businessApi } from '../utils/api';

interface Props {
  onSelect: () => void;
}

const ModeSelector: React.FC<Props> = ({ onSelect }) => {
  const { user, setActiveMode, updateUser } = useAuth();
  const [activating, setActivating] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const handleSelectPersonal = () => {
    setActiveMode('personal');
    onSelect();
  };

  const handleSelectBusiness = () => {
    if (user?.mode === 'business') {
      setActiveMode('business');
      onSelect();
    } else {
      setShowForm(true);
    }
  };

  const handleActivar = async () => {
    if (!businessName.trim()) {
      setError('Escribe el nombre de tu negocio');
      return;
    }
    setActivating(true);
    setError('');
    try {
      await businessApi.activar(businessName.trim());
      updateUser({ mode: 'business', businessName: businessName.trim() });
      setActiveMode('business');
      onSelect();
    } catch {
      setError('Error al activar el modo negocio');
    } finally {
      setActivating(false);
    }
  };

  if (showForm) {
    return (
      <div className="mode-screen">
        <div className="mode-card">
          <span className="mode-back" onClick={() => setShowForm(false)}>← Regresar</span>
          <div className="mode-icon">🏪</div>
          <h2 className="mode-title">Activa tu negocio</h2>
          <p className="mode-subtitle">¿Cómo se llama tu negocio?</p>
          <div className="form-group" style={{ marginTop: 20 }}>
            <input
              type="text"
              placeholder="Ej: Abarrotes Don Pepe"
              value={businessName}
              onChange={(e) => { setBusinessName(e.target.value); setError(''); }}
              maxLength={100}
            />
            {error && <span className="field-error">{error}</span>}
          </div>
          <button
            className="submit-btn"
            style={{ marginTop: 16 }}
            onClick={handleActivar}
            disabled={activating}
          >
            {activating ? 'Activando...' : 'Activar modo negocio'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mode-screen">
      <div className="mode-card">
        <img src="/logo.png" alt="WalletGo" className="mode-logo" />
        <h2 className="mode-title">Hola, {user?.name} 👋</h2>
        <p className="mode-subtitle">¿Qué quieres gestionar hoy?</p>

        <div className="mode-options">
          <button className="mode-option personal" onClick={handleSelectPersonal}>
            <span className="mode-option-icon">👤</span>
            <span className="mode-option-label">Personal</span>
            <span className="mode-option-desc">Mis finanzas personales</span>
          </button>

          <button className="mode-option business" onClick={handleSelectBusiness}>
            <span className="mode-option-icon">🏪</span>
            <span className="mode-option-label">Negocio</span>
            <span className="mode-option-desc">
              {user?.mode === 'business' && user?.businessName
                ? user.businessName
                : 'Gestionar mi tienda'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;