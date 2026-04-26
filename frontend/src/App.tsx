import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetPanel from './components/BudgetPanel';
import AuthScreen from './components/AuthScreen';
import './styles/global.css';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="app-loading">
        <span>💰</span>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  return (
    <WalletProvider>
      <div className="app">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="main-content">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'add' && <TransactionForm />}
          {activeTab === 'transactions' && <TransactionList />}
          {activeTab === 'budget' && <BudgetPanel />}
        </main>
        <footer className="app-footer">
          <p>WalletGo — Control financiero para estudiantes</p>
        </footer>
      </div>
    </WalletProvider>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;