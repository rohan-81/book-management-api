import React, { useState, useEffect } from 'react';
import { X, Save, PlusCircle } from 'lucide-react';

export default function BookModal({
  isOpen,
  onClose,
  onSubmit,
  initialBook,
  authors,
  onQuickAddAuthor
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    published_date: new Date().toISOString().split('T')[0],
    author: '',
    available: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialBook) {
      const authorId = initialBook.author_details?.id || (typeof initialBook.author === 'object' ? initialBook.author?.id : initialBook.author);
      setFormData({
        title: initialBook.title || '',
        description: initialBook.description || '',
        price: initialBook.price || '',
        published_date: initialBook.published_date || '',
        author: authorId ? String(authorId) : '',
        available: Boolean(initialBook.available),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        published_date: new Date().toISOString().split('T')[0],
        author: authors.length > 0 ? String(authors[0].id) : '',
        available: true,
      });
    }
    setError('');
  }, [initialBook, isOpen, authors]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please enter a book title.');
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      setError('Please enter a valid positive price.');
      return;
    }
    if (!formData.author) {
      setError('Please select an author or add one first.');
      return;
    }
    if (!formData.published_date) {
      setError('Please provide a published date.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price).toFixed(2),
        published_date: formData.published_date,
        author: parseInt(formData.author, 10),
        available: formData.available,
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save book.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {initialBook ? `Edit "${initialBook.title}"` : 'Add New Book'}
          </h2>
          <button
            id="btn-close-book-modal"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fb7185',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="book-title-input" className="form-label">
                Book Title *
              </label>
              <input
                id="book-title-input"
                className="form-input"
                type="text"
                required
                placeholder="e.g. Clean Code"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="book-author-select" className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Author *</span>
                {onQuickAddAuthor && (
                  <button
                    type="button"
                    onClick={onQuickAddAuthor}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#818cf8',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <PlusCircle size={13} /> + New Author
                  </button>
                )}
              </label>
              <select
                id="book-author-select"
                className="form-select"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              >
                <option value="">Select Author...</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.email})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="book-price-input" className="form-label">
                  Price ($) *
                </label>
                <input
                  id="book-price-input"
                  className="form-input"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="29.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="book-published-date-input" className="form-label">
                  Published Date *
                </label>
                <input
                  id="book-published-date-input"
                  className="form-input"
                  type="date"
                  required
                  value={formData.published_date}
                  onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="book-desc-textarea" className="form-label">
                Description / Synopsis
              </label>
              <textarea
                id="book-desc-textarea"
                className="form-textarea"
                rows="3"
                placeholder="Brief summary or description of the book..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-checkbox-label">
                <input
                  id="book-availability-checkbox"
                  type="checkbox"
                  className="form-checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                />
                <span>Book is available in stock</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              id="btn-cancel-book-modal"
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              id="btn-save-book-modal"
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <Save size={16} />
              <span>{submitting ? 'Saving...' : initialBook ? 'Update Book' : 'Create Book'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
