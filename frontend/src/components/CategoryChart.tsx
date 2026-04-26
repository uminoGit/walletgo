import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
  transactions: Transaction[];
}

const COLORS = [
  '#2563eb', '#1a7a4a', '#d97706', '#c0392b', '#7c3aed',
  '#0891b2', '#be185d', '#65a30d', '#ea580c', '#0f766e',
];

const CategoryChart: React.FC<Props> = ({ transactions }) => {
  const expenses = transactions.filter((t) => t.type === 'expense');

  const dataMap: Record<string, number> = {};
  expenses.forEach((t) => {
    dataMap[t.category] = (dataMap[t.category] || 0) + t.amount;
  });

  const data = Object.entries(dataMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">Gastos por categoría</h3>
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <p>Sin gastos registrados aún.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">Gastos por categoría</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e0d8',
              fontSize: '13px',
              fontFamily: 'Sora, sans-serif',
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: '12px', fontFamily: 'Sora, sans-serif' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;