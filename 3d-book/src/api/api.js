// --- START OF FILE src/api.js ---

const API_BASE = 'http://localhost:5000/api';

// Helper to get current User ID (Simple LocalStorage impl)
const getUser = () => {
    const userStr = localStorage.getItem('book_user');
    return userStr ? JSON.parse(userStr) : null;
};

export const api = {
    // --- AUTH ---
    login: async (email, password) => {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('book_user', JSON.stringify(data.user));
        }
        return data;
    },

    register: async (email, password) => {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await res.json();
    },

    logout: () => {
        localStorage.removeItem('book_user');
    },

    getCurrentUser: () => getUser(),

    // --- BOOKS ---
    
    // Get all books for the logged-in user
    fetchAllBooks: async () => {
        const user = getUser();
        if (!user) return [];
        
        try {
            const res = await fetch(`${API_BASE}/books?userId=${user.id}`);
            return await res.json();
        } catch (err) {
            console.error("API Error:", err);
            return [];
        }
    },

    // Create a new book
    createBook: async (bookData) => {
        const user = getUser();
        if (!user) throw new Error("Not logged in");

        const formData = new FormData();
        formData.append('userId', user.id);
        formData.append('title', bookData.title);
        formData.append('author', bookData.author);
        formData.append('genre', bookData.genre);
        formData.append('publishDate', bookData.publishDate);
        formData.append('notes', bookData.notes);

        if (bookData.coverFile) {
            formData.append('cover', bookData.coverFile);
        }

        const res = await fetch(`${API_BASE}/books`, {
            method: 'POST',
            body: formData
        });
        return await res.json();
    },

    // Update Book
    updateBook: async (id, updates) => {
        const formData = new FormData();
        
        Object.keys(updates).forEach(key => {
            if (key === 'coverFile' && updates[key]) {
                 formData.append('cover', updates[key]);
            } else {
                 formData.append(key, updates[key]);
            }
        });

        const res = await fetch(`${API_BASE}/books/${id}`, {
            method: 'PUT',
            body: formData
        });
        return await res.json();
    }
};