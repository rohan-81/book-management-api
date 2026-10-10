import React, { useState } from 'react';
import { X, UserPlus, Mail, BookOpen, AlertCircle } from 'lucide-react';

export default function AuthorModal({
  isOpen,
  onClose,
  authors,
  onAddAuthor,
  onSelectAuthorFilter,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Please fill in both name and email.');
      return;
    }

    setSubmitting(true);
    try {
      await onAddAuthor({ name: name.trim(), email: email.trim() });
      setName('');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to create author.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Authors Directory</h2>
          <button
            id="btn-close-author-modal"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Add Author Subform */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h3 style={{ fontSize: '1rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <UserPlus size={18} color="#6366f1" />
              <span>Add New Author</span>
            </h3>

            {error && (
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fb7185',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                id="author-name-input"
                className="form-input"
                type="text"
                placeholder="Author Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                id="author-email-input"
                className="form-input"
                type="email"
                placeholder="author@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                id="btn-submit-author"
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', alignSelf: 'flex-start' }}
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Save Author'}
              </button>
            </form>
          </div>

          {/* List of Authors */}
          <div>
            <h3 style={{ fontSize: '1rem', margin: '1rem 0 0.75rem' }}>
              Registered Authors ({authors.length})
            </h3>
            <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {authors.length === 0 ? (
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No authors registered yet.</p>
              ) : (
                authors.map((a) => (
                  <div key={a.id} className="author-list-item">
                    <div className="author-info">
                      <h4>{a.name}</h4>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Mail size={12} />
                        <span>{a.email}</span>
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="author-pill">
                        {a.books_count || 0} books
                      </span>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                        onClick={() => {
                          onSelectAuthorFilter(a.id);
                          onClose();
                        }}
                        title="Filter books by this author"
                      >
                        <BookOpen size={13} />
                        <span>Filter</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button id="btn-close-author-modal-bottom" type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
