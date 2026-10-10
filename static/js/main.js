/**
 * Main JavaScript Application Logic for Book Management System
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Switcher (Dark / Light Mode)
    initTheme();

    // 2. Auto Dismiss Flash Toasts
    initToasts();

    // 3. Delete Confirmation Modals
    initDeleteModals();
});

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeToggleBtn.title = 'Switch to Light Mode';
        } else {
            themeIcon.textContent = '🌙';
            themeToggleBtn.title = 'Switch to Dark Mode';
        }
    }
}

function initToasts() {
    const toasts = document.querySelectorAll('.toast');
    toasts.forEach(toast => {
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 400);
        }, 5000);

        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.remove();
            });
        }
    });
}

function initDeleteModals() {
    const modalOverlay = document.getElementById('delete-modal-overlay');
    const modalBookTitle = document.getElementById('modal-book-title');
    const modalDeleteForm = document.getElementById('modal-delete-form');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const triggerButtons = document.querySelectorAll('.btn-trigger-delete');

    if (!modalOverlay) return;

    triggerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const bookId = btn.getAttribute('data-book-id');
            const bookTitle = btn.getAttribute('data-book-title');
            const deleteUrl = btn.getAttribute('data-delete-url');

            if (modalBookTitle) modalBookTitle.textContent = bookTitle;
            if (modalDeleteForm) modalDeleteForm.setAttribute('action', deleteUrl);

            modalOverlay.classList.add('active');
        });
    });

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            modalOverlay.classList.remove('active');
        }
    });
}
