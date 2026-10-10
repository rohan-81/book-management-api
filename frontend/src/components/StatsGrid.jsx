import React from 'react';
import { BookMarked, CheckCircle2, XCircle, Users, DollarSign } from 'lucide-react';

export default function StatsGrid({ stats }) {
  if (!stats) return null;

  const statItems = [
    {
      title: 'Total Books',
      value: stats.total_books ?? 0,
      sub: 'Catalog collection',
      icon: <BookMarked size={20} />,
      accent: '#6366f1',
    },
    {
      title: 'In Stock',
      value: stats.available_books ?? 0,
      sub: 'Ready for loan / read',
      icon: <CheckCircle2 size={20} />,
      accent: '#10b981',
    },
    {
      title: 'Out of Stock',
      value: stats.out_of_stock_books ?? 0,
      sub: 'Currently unavailable',
      icon: <XCircle size={20} />,
      accent: '#f43f5e',
    },
    {
      title: 'Authors',
      value: stats.total_authors ?? 0,
      sub: 'Registered writers',
      icon: <Users size={20} />,
      accent: '#8b5cf6',
    },
    {
      title: 'Avg Price',
      value: `$${Number(stats.avg_price ?? 0).toFixed(2)}`,
      sub: 'Per book average',
      icon: <DollarSign size={20} />,
      accent: '#06b6d4',
    },
  ];

  return (
    <section className="stats-grid" aria-label="Book statistics summary">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="stat-card"
          style={{ '--card-accent': item.accent }}
        >
          <div className="stat-header">
            <span className="stat-title">{item.title}</span>
            <div className="stat-icon">{item.icon}</div>
          </div>
          <div className="stat-value">{item.value}</div>
          <div className="stat-sub">{item.sub}</div>
        </div>
      ))}
    </section>
  );
}
