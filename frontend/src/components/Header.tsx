import React from 'react';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'dashboard', label: 'Inicio' },
  { id: 'add', label: 'Agregar' },
  { id: 'transactions', label: 'Historial' },
  { id: 'budget', label: 'Presupuesto' },
];

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { error, clearError } = useWallet();
  const { user, logout } = useAuth();

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
           <img src="/logo.png" alt="WalletGo" className="brand-logo" />
            <span className="brand-name">WalletGo</span>
          </div>
          <nav className="nav-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="header-user">
            <span className="user-name">{user?.name}</span>
            <button className="logout-btn" onClick={logout}>Salir</button>
          </div>
        </div>
      </header>

      {error && (
        <div className="global-error">
          <span>{error}</span>
          <button onClick={clearError} className="error-close">✕</button>
        </div>
      )}
    </>
  );
};

export default Header;