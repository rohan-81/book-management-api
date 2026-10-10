import React from 'react';
import { BookOpen, Plus, Users, RefreshCw, Sun, Moon } from 'lucide-react';

export default function Navbar({
  onAddBook,
  onOpenAuthors,
  onRefresh,
  isConnected,
  loading,
  theme,
  onToggleTheme,
}) {
  return (
    <header className="navbar">
      <div className="container nav-content">
        <div className="brand">
          <div className="brand-icon">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="brand-title">BookVerse</h1>
            <span className="brand-badge">DRF Backend</span>
          </div>
        </div>

        <div className="nav-actions">
          <div className="api-pill" title={isConnected ? 'Backend connected' : 'Connecting to DRF...'}>
            <span className="api-dot" style={{ backgroundColor: isConnected ? '#10b981' : '#f43f5e' }} />
            <span>{isConnected ? 'DRF API Live' : 'Connecting...'}</span>
          </div>

          <button
            id="btn-theme-toggle"
            className="btn btn-secondary btn-icon theme-toggle-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          <button
            id="btn-refresh-data"
            className="btn btn-secondary btn-icon"
            onClick={onRefresh}
            title="Refresh Data"
            disabled={loading}
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            id="btn-open-authors-modal"
            className="btn btn-secondary"
            onClick={onOpenAuthors}
          >
            <Users size={17} />
            <span>Authors</span>
          </button>

          <button
            id="btn-add-new-book"
            className="btn btn-primary"
            onClick={onAddBook}
          >
            <Plus size={18} />
            <span>Add Book</span>
          </button>
        </div>
      </div>
    </header>
  );
}

