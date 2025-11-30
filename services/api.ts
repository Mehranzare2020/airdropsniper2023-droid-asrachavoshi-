import { Artwork, Book, JournalPost } from '../types';

// On Vercel, the API is hosted on the same domain at /api
// Locally, it might be on port 3001 if run separately, but usually we proxy it.
// By using a relative path, Vercel handles the routing automatically via vercel.json
const API_BASE_URL = ''; 

export const api = {
  // Sync all data on load
  syncData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sync`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.warn("API Offline or Unreachable. Switching to Mock Data.");
      return null;
    }
  },

  // Artworks
  createArtwork: async (art: Artwork) => {
    return fetch(`${API_BASE_URL}/api/artworks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(art)
    });
  },
  deleteArtwork: async (id: string) => {
    return fetch(`${API_BASE_URL}/api/artworks/${id}`, { method: 'DELETE' });
  },

  // Books
  createBook: async (book: Book) => {
    return fetch(`${API_BASE_URL}/api/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
    });
  },
  deleteBook: async (id: string) => {
    return fetch(`${API_BASE_URL}/api/books/${id}`, { method: 'DELETE' });
  },

  // Journal
  createJournal: async (post: JournalPost) => {
    return fetch(`${API_BASE_URL}/api/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
  },
  deleteJournal: async (id: string) => {
    return fetch(`${API_BASE_URL}/api/journal/${id}`, { method: 'DELETE' });
  }
};