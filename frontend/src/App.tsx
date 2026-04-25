import React, { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetPanel from './components/BudgetPanel';
import './styles/global.css';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
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
  );
};

const App: React.FC = () => (
  <WalletProvider>
    <AppContent />
  </WalletProvider>
);

export default App;
