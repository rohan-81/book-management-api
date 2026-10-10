import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function ControlsBar({
  search,
  onSearchChange,
  author,
  onAuthorChange,
  authors,
  availability,
  onAvailabilityChange,
  ordering,
  onOrderingChange,
  totalResults
}) {
  return (
    <div className="controls-bar">
      {/* Search Bar */}
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          id="search-books-input"
          type="text"
          className="search-input"
          placeholder="Search by title, description, or author..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            id="clear-search-btn"
            className="search-clear"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filters-group">
        {/* Author filter */}
        <select
          id="filter-by-author-select"
          className="select-custom"
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          aria-label="Filter by author"
        >
          <option value="">All Authors</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.books_count || 0})
            </option>
          ))}
        </select>

        {/* Availability Segmented Tabs */}
        <div className="segmented-control" role="group" aria-label="Filter by availability">
          <button
            id="tab-avail-all"
            type="button"
            className={`seg-btn ${availability === '' ? 'active' : ''}`}
            onClick={() => onAvailabilityChange('')}
          >
            All
          </button>
          <button
            id="tab-avail-true"
            type="button"
            className={`seg-btn ${availability === 'true' ? 'active' : ''}`}
            onClick={() => onAvailabilityChange('true')}
          >
            In Stock
          </button>
          <button
            id="tab-avail-false"
            type="button"
            className={`seg-btn ${availability === 'false' ? 'active' : ''}`}
            onClick={() => onAvailabilityChange('false')}
          >
            Out of Stock
          </button>
        </div>

        {/* Sorting Dropdown */}
        <select
          id="sort-books-select"
          className="select-custom"
          value={ordering}
          onChange={(e) => onOrderingChange(e.target.value)}
          aria-label="Sort books by"
        >
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="title">Title: A to Z</option>
          <option value="-title">Title: Z to A</option>
        </select>
      </div>
    </div>
  );
}
