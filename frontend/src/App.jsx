import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from './api';
import Navbar from './components/Navbar';
import StatsGrid from './components/StatsGrid';
import ControlsBar from './components/ControlsBar';
import BookCard from './components/BookCard';
import BookModal from './components/BookModal';
import AuthorModal from './components/AuthorModal';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';
import { BookOpen, Plus, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export default function App() {
  // Data States
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [stats, setStats] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [availability, setAvailability] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [page, setPage] = useState(1);

  // Theme State (Dark / Light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bookverse_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bookverse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Modal States
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [authorModalOpen, setAuthorModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);


  // Toast System
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };
  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search change
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Authors & Stats
  const loadMeta = useCallback(async () => {
    try {
      const [authorsRes, statsRes] = await Promise.all([
        api.getAuthors(),
        api.getStats(),
      ]);
      setAuthors(authorsRes.results || (Array.isArray(authorsRes) ? authorsRes : []));
      setStats(statsRes);
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to load authors/stats:', err);
      setIsConnected(false);
    }
  }, []);

  // Fetch Books with active filters
  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getBooks({
        search: debouncedSearch,
        author: selectedAuthor,
        available: availability,
        ordering,
        page,
      });

      if (res && res.results) {
        setBooks(res.results);
        setTotalCount(res.count || res.results.length);
      } else if (Array.isArray(res)) {
        setBooks(res);
        setTotalCount(res.length);
      } else {
        setBooks([]);
        setTotalCount(0);
      }
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setIsConnected(false);
      addToast(err.message || 'Error connecting to DRF API server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedAuthor, availability, ordering, page]);

  // Initial Load & on filter change
  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Refresh handler
  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([loadMeta(), loadBooks()]);
    addToast('Data refreshed successfully from DRF!', 'info');
  };

  // Actions
  const handleToggleAvailability = async (id) => {
    try {
      // Optimistic update
      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, available: !b.available } : b))
      );

      const res = await api.toggleAvailability(id);
      addToast(res.message || 'Book status updated!', 'success');
      // Refresh stats
      loadMeta();
    } catch (err) {
      // Revert if error
      loadBooks();
      addToast(err.message || 'Could not toggle availability.', 'error');
    }
  };

  const handleSaveBook = async (bookData) => {
    if (editingBook) {
      await api.updateBook(editingBook.id, bookData);
      addToast(`Book "${bookData.title}" updated successfully!`, 'success');
    } else {
      await api.createBook(bookData);
      addToast(`Book "${bookData.title}" created successfully!`, 'success');
    }
    await Promise.all([loadBooks(), loadMeta()]);
  };

  const handleDeleteBook = async (id) => {
    try {
      await api.deleteBook(id);
      addToast('Book deleted successfully.', 'success');
      await Promise.all([loadBooks(), loadMeta()]);
    } catch (err) {
      addToast(err.message || 'Failed to delete book.', 'error');
    }
  };

  const handleAddAuthor = async (authorData) => {
    await api.createAuthor(authorData);
    addToast(`Author "${authorData.name}" added successfully!`, 'success');
    await loadMeta();
  };

  return (
    <div>
      {/* Navigation */}
      <Navbar
        isConnected={isConnected}
        loading={loading}
        theme={theme}
        onToggleTheme={toggleTheme}
        onRefresh={handleRefresh}
        onAddBook={() => {
          setEditingBook(null);
          setBookModalOpen(true);
        }}
        onOpenAuthors={() => setAuthorModalOpen(true)}
      />


      <main className="container">
        {/* Stats Cards */}
        <StatsGrid stats={stats} />

        {/* Controls, Filters, Search */}
        <ControlsBar
          search={search}
          onSearchChange={setSearch}
          author={selectedAuthor}
          onAuthorChange={(val) => {
            setSelectedAuthor(val);
            setPage(1);
          }}
          authors={authors}
          availability={availability}
          onAvailabilityChange={(val) => {
            setAvailability(val);
            setPage(1);
          }}
          ordering={ordering}
          onOrderingChange={setOrdering}
          totalResults={totalCount}
        />

        {/* Books List / Grid */}
        {loading && books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Layers size={32} className="animate-spin" />
            </div>
            <h2 className="empty-title">Connecting to Books API...</h2>
            <p className="empty-desc">Fetching catalogue from Django REST Framework backend.</p>
          </div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <BookOpen size={32} />
            </div>
            <h2 className="empty-title">No Books Found</h2>
            <p className="empty-desc">
              {search || selectedAuthor || availability
                ? 'No books match your active filters. Try clearing filters or search terms.'
                : 'There are currently no books in the library. Click "Add Book" to create your first entry!'}
            </p>
            <button
              id="btn-empty-add-book"
              className="btn btn-primary"
              onClick={() => {
                setEditingBook(null);
                setBookModalOpen(true);
              }}
            >
              <Plus size={18} />
              <span>Add First Book</span>
            </button>
          </div>
        ) : (
          <section className="books-grid" aria-label="Books list">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={(b) => {
                  setEditingBook(b);
                  setBookModalOpen(true);
                }}
                onDelete={(b) => {
                  setBookToDelete(b);
                  setDeleteModalOpen(true);
                }}
                onToggleAvailability={handleToggleAvailability}
                onSelectAuthor={(authId) => {
                  setSelectedAuthor(String(authId));
                  setPage(1);
                }}
              />
            ))}
          </section>
        )}

        {/* Pagination Controls */}
        {totalCount > 10 && (
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '1.5rem',
            }}
            aria-label="Pagination"
          >
            <button
              id="btn-prev-page"
              className="btn btn-secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Page <strong>{page}</strong> of <strong>{Math.ceil(totalCount / 10)}</strong>
            </span>

            <button
              id="btn-next-page"
              className="btn btn-secondary"
              disabled={page >= Math.ceil(totalCount / 10)}
              onClick={() => setPage((p) => p + 1)}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </nav>
        )}
      </main>

      {/* Modals */}
      <BookModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSubmit={handleSaveBook}
        initialBook={editingBook}
        authors={authors}
        onQuickAddAuthor={() => setAuthorModalOpen(true)}
      />

      <AuthorModal
        isOpen={authorModalOpen}
        onClose={() => setAuthorModalOpen(false)}
        authors={authors}
        onAddAuthor={handleAddAuthor}
        onSelectAuthorFilter={(authId) => {
          setSelectedAuthor(String(authId));
          setPage(1);
        }}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteBook}
        book={bookToDelete}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
