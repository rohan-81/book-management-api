import React, { useState } from 'react';
import { User, Calendar, Edit3, Trash2, Check, X, RefreshCw } from 'lucide-react';

export default function BookCard({ book, onEdit, onDelete, onToggleAvailability, onSelectAuthor }) {
  const [isToggling, setIsToggling] = useState(false);

  const authorName = book.author_details?.name || (typeof book.author === 'object' ? book.author?.name : 'Unknown Author');
  const authorId = book.author_details?.id || (typeof book.author === 'object' ? book.author?.id : book.author);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleAvailability(book.id);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <article className="book-card" id={`book-card-${book.id}`}>
      <div>
        <div className="book-top">
          <div>
            <h3 className="book-title">{book.title}</h3>
            <button
              type="button"
              className="book-author-tag"
              onClick={() => onSelectAuthor && onSelectAuthor(authorId)}
              title={`Filter by ${authorName}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <User size={13} />
              <span>{authorName}</span>
            </button>
          </div>

          <span
            className={`badge-availability ${
              book.available ? 'badge-available' : 'badge-unavailable'
            }`}
          >
            {book.available ? <Check size={12} /> : <X size={12} />}
            {book.available ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <p className="book-desc" style={{ marginTop: '0.85rem' }}>
          {book.description || 'No description provided for this book.'}
        </p>
      </div>

      <div>
        <div className="book-meta">
          <div>
            <div className="book-price">${Number(book.price).toFixed(2)}</div>
            <div className="book-date" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
              <Calendar size={12} />
              <span>{book.published_date || 'Date not set'}</span>
            </div>
          </div>

          <div className="book-actions">
            <button
              id={`btn-edit-book-${book.id}`}
              className="btn btn-secondary btn-icon"
              onClick={() => onEdit(book)}
              title="Edit book details"
            >
              <Edit3 size={15} />
            </button>
            <button
              id={`btn-delete-book-${book.id}`}
              className="btn btn-outline-danger btn-icon"
              onClick={() => onDelete(book)}
              title="Delete book"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <div style={{ marginTop: '0.85rem' }}>
          <button
            id={`btn-toggle-availability-${book.id}`}
            type="button"
            className={`btn toggle-btn ${book.available ? 'btn-secondary' : 'btn-primary'}`}
            style={{ width: '100%' }}
            onClick={handleToggle}
            disabled={isToggling}
          >
            {isToggling ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : book.available ? (
              'Mark as Out of Stock'
            ) : (
              'Mark as In Stock'
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
