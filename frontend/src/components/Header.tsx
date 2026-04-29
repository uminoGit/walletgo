import React from 'react';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSwitchMode: () => void;
}

const PERSONAL_TABS = [
  { id: 'dashboard', label: 'Inicio' },
  { id: 'add', label: 'Agregar' },
  { id: 'transactions', label: 'Historial' },
  { id: 'budget', label: 'Presupuesto' },
];

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onSwitchMode }) => {
  const { user, logout, activeMode } = useAuth();

  let walletError: string | null = null;
  let clearWalletError: (() => void) | null = null;

  try {
    const wallet = useWallet();
    walletError = wallet.error;
    clearWalletError = wallet.clearError;
  } catch {
    // En modo business WalletContext no está disponible
  }

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <img src="/logo.png" alt="WalletGo" className="brand-logo" />
            <span className="brand-name">WalletGo</span>
            {activeMode === 'business' && (
              <span className="mode-badge">Negocio</span>
            )}
          </div>

          {activeMode === 'personal' && (
            <nav className="nav-tabs">
              {PERSONAL_TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => onTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          )}

          <div className="header-user">
            <button className="switch-mode-btn" onClick={onSwitchMode}>
              Cambiar modo
            </button>
            <span className="user-name">{user?.name}</span>
            <button className="logout-btn" onClick={logout}>Salir</button>
          </div>
        </div>
      </header>

      {walletError && clearWalletError && (
        <div className="global-error">
          <span>{walletError}</span>
          <button onClick={clearWalletError} className="error-close">✕</button>
        </div>
      )}
    </>
  );
};

export default Header;