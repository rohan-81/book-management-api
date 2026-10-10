const BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Helper to handle fetch responses with meaningful error extraction
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorData = await response.json();
      if (typeof errorData === 'object' && errorData !== null) {
        // Collect field errors from DRF
        const messages = Object.entries(errorData)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join(' | ');
        errorMessage = messages || errorMessage;
      }
    } catch {
      // response was not JSON
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  // Books API
  async getBooks({ search = '', author = '', available = '', ordering = '', page = 1 } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (author) params.append('author', author);
    if (available) params.append('available', available);
    if (ordering) params.append('ordering', ordering);
    if (page && page > 1) params.append('page', page);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${BASE_URL}/books/${query}`);
    return handleResponse(res);
  },

  async getBook(id) {
    const res = await fetch(`${BASE_URL}/books/${id}/`);
    return handleResponse(res);
  },

  async createBook(data) {
    const res = await fetch(`${BASE_URL}/books/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateBook(id, data) {
    const res = await fetch(`${BASE_URL}/books/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteBook(id) {
    const res = await fetch(`${BASE_URL}/books/${id}/`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  async toggleAvailability(id) {
    const res = await fetch(`${BASE_URL}/books/${id}/toggle-availability/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(res);
  },

  async getStats() {
    const res = await fetch(`${BASE_URL}/books/stats/`);
    return handleResponse(res);
  },

  // Authors API
  async getAuthors() {
    const res = await fetch(`${BASE_URL}/authors/`);
    return handleResponse(res);
  },

  async createAuthor(data) {
    const res = await fetch(`${BASE_URL}/authors/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getAuthorBooks(authorId) {
    const res = await fetch(`${BASE_URL}/authors/${authorId}/books/`);
    return handleResponse(res);
  },

  // Health check
  async checkHealth() {
    try {
      const res = await fetch(`${BASE_URL}/books/stats/`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  }
};
