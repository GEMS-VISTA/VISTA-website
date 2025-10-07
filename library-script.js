// Library Page Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Search functionality
    const searchInput = document.getElementById('document-search');
    const searchBtn = document.querySelector('.search-btn');
    const filterTabs = document.querySelectorAll('.category-btn');
    const bookSpines = document.querySelectorAll('.book-spine');
    const shelfSections = document.querySelectorAll('.shelf-section');

    // Filter by category
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterDocuments(filter);
        });
    });

    // Search function
    function searchDocuments(query) {
        const searchTerm = query.toLowerCase();
        
        bookSpines.forEach(book => {
            const title = book.querySelector('.book-title').textContent.toLowerCase();
            const author = book.querySelector('.book-author').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || author.includes(searchTerm)) {
                book.style.display = 'flex';
            } else {
                book.style.display = 'none';
            }
        });
        
        // Hide empty shelves
        shelfSections.forEach(section => {
            const visibleBooks = section.querySelectorAll('.book-spine[style*="flex"]');
            const allBooks = section.querySelectorAll('.book-spine');
            const hasVisibleBooks = Array.from(allBooks).some(book => 
                book.style.display !== 'none'
            );
            
            if (!hasVisibleBooks && searchTerm) {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
            }
        });
    }

    // Filter function
    function filterDocuments(category) {
        if (category === 'all') {
            bookSpines.forEach(book => book.style.display = 'flex');
            shelfSections.forEach(section => section.style.display = 'block');
        } else {
            bookSpines.forEach(book => {
                if (book.dataset.category === category) {
                    book.style.display = 'flex';
                } else {
                    book.style.display = 'none';
                }
            });
            
            // Show/hide shelves based on filter
            shelfSections.forEach(section => {
                const categoryBooks = section.querySelectorAll(`[data-category="${category}"]`);
                if (categoryBooks.length > 0) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        }
    }

    // Search input events
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchDocuments(this.value);
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDocuments(this.value);
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            if (searchInput) {
                searchDocuments(searchInput.value);
            }
        });
    }

    // Book spine interactions
    console.log('Found book spines:', bookSpines.length);
    bookSpines.forEach(book => {
        book.addEventListener('click', function() {
            console.log('Book spine clicked!');
            const title = this.querySelector('.book-title').textContent;
            const author = this.querySelector('.book-author').textContent;
            const year = this.querySelector('.book-year').textContent;
            const fileName = this.getAttribute('data-file');
            
            console.log('Opening modal for:', title, fileName);
            openDocumentModal(title, author, year, fileName);
        });

        // Hover effects are now handled purely through CSS for smoother transitions
    });

    // Document modal functionality
    const documentModal = document.getElementById('documentModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalClose = document.querySelector('.modal-close');
    const btnCloseModal = document.querySelector('.btn-close-modal');

    function openDocumentModal(title, author, year, fileName = null) {
        console.log('openDocumentModal called with:', title, fileName);
        modalTitle.textContent = title;
        documentModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Store fileName for download
        documentModal.setAttribute('data-file', fileName || '');
        
        // Add document info to modal
        const modalBody = document.querySelector('.modal-body');
        
        if (fileName) {
            // Show actual PDF viewer - minimal info, focus on PDF
            modalBody.innerHTML = `
                <div class="pdf-viewer-container">
                    <div class="document-header">
                        <h4>${title}</h4>
                        <span class="document-meta">${author} • ${year}</span>
                    </div>
                    <div class="pdf-viewer">
                        <iframe 
                            src="documents/${fileName}" 
                            width="100%" 
                            height="100%" 
                            style="border: none; border-radius: 8px;"
                            title="PDF Viewer for ${title}">
                            <p>Your browser does not support PDFs. 
                               <a href="documents/${fileName}" target="_blank">Click here to view the PDF</a>
                            </p>
                        </iframe>
                    </div>
                </div>
            `;
        } else {
            // Fallback for documents without files
            modalBody.innerHTML = `
                <div class="document-info">
                    <h3>${title}</h3>
                    <p><strong>Author:</strong> ${author}</p>
                    <p><strong>Year:</strong> ${year}</p>
                    <div class="viewer-placeholder">
                        <p>📄 Document preview would appear here</p>
                        <p>In a full implementation, this would show PDF/PPTX content</p>
                        <p style="margin-top: 2rem; font-style: italic;">
                            Click "Download Document" to access the full file
                        </p>
                    </div>
                </div>
            `;
        }
    }

    function closeDocumentModal() {
        documentModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    modalClose.addEventListener('click', closeDocumentModal);
    btnCloseModal.addEventListener('click', closeDocumentModal);

    // Close modal when clicking outside
    documentModal.addEventListener('click', function(e) {
        if (e.target === documentModal) {
            closeDocumentModal();
        }
    });

    // Featured document interactions
    const viewButtons = document.querySelectorAll('.btn-view');
    const downloadButtons = document.querySelectorAll('.btn-download');

    console.log('Found view buttons:', viewButtons.length);
    console.log('Found download buttons:', downloadButtons.length);

    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('View button clicked!');
            const docTitle = this.closest('.featured-doc').querySelector('h3').textContent;
            const fileName = this.getAttribute('data-file');
            console.log('View button - Title:', docTitle, 'File:', fileName);
            openDocumentModal(docTitle, 'Team VISTA', '2024', fileName);
        });
    });

    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const fileName = this.getAttribute('data-file');
            if (fileName) {
                downloadDocument(fileName);
            } else {
                const docTitle = this.closest('.featured-doc').querySelector('h3').textContent;
                simulateDownload(docTitle);
            }
        });
    });

    // Download functionality
    const downloadModalBtn = document.querySelector('.btn-download-modal');
    if (downloadModalBtn) {
        downloadModalBtn.addEventListener('click', function() {
            const fileName = documentModal.getAttribute('data-file');
            if (fileName) {
                downloadDocument(fileName);
            } else {
                const title = modalTitle.textContent;
                simulateDownload(title);
            }
        });
    }

    function downloadDocument(fileName) {
        // Create download link for actual file
        const link = document.createElement('a');
        link.href = `documents/${fileName}`;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show download notification
        showDownloadNotification(fileName);
    }

    function simulateDownload(filename) {
        showDownloadNotification(filename, true);
    }

    function showDownloadNotification(filename, isSimulated = false) {
        // Create a temporary download notification
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--library-gold);
                color: var(--library-ink);
                padding: 1rem 2rem;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 10000;
                font-weight: 500;
                max-width: 300px;
            ">
                📥 ${isSimulated ? 'Simulating download:' : 'Downloading:'} ${filename}
                ${isSimulated ? '<br><small>In a real implementation, the file would download here.</small>' : ''}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Entrance animation
    const entranceContent = document.querySelector('.entrance-content');
    if (entranceContent) {
        setTimeout(() => {
            entranceContent.style.opacity = '0';
            entranceContent.style.transform = 'translateY(20px)';
            entranceContent.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                entranceContent.style.opacity = '1';
                entranceContent.style.transform = 'translateY(0)';
            }, 100);
        }, 500);
    }

    // Enhanced scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Animate main sections with staggered delay
    document.querySelectorAll('.reading-room, .catalog-drawer').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = `all 0.8s ease ${index * 0.3}s`;
        observer.observe(section);
    });

    // Animate featured documents
    document.querySelectorAll('.featured-doc').forEach((doc, index) => {
        doc.style.opacity = '0';
        doc.style.transform = 'translateX(-30px)';
        doc.style.transition = `all 0.7s ease ${index * 0.2}s`;
        observer.observe(doc);
    });

    // Animate book shelves with wave effect
    document.querySelectorAll('.shelf-section').forEach((shelf, index) => {
        shelf.style.opacity = '0';
        shelf.style.transform = 'translateY(20px)';
        shelf.style.transition = `all 0.6s ease ${index * 0.15}s`;
        observer.observe(shelf);
    });

    // Animate individual book spines
    document.querySelectorAll('.book-spine').forEach((book, index) => {
        book.style.opacity = '0';
        book.style.transform = 'translateY(10px) rotateY(-5deg)';
        book.style.transition = `all 0.5s ease ${index * 0.05}s`;
        observer.observe(book);
    });

    // Animate filter tabs
    document.querySelectorAll('.category-btn').forEach((tab, index) => {
        tab.style.opacity = '0';
        tab.style.transform = 'translateY(-10px)';
        tab.style.transition = `all 0.4s ease ${index * 0.1}s`;
        observer.observe(tab);
    });

    // Add reading lamp effect
    function addReadingLampEffect() {
        const readingRoom = document.querySelector('.reading-room');
        if (readingRoom) {
            const lamp = document.createElement('div');
            lamp.style.cssText = `
                position: absolute;
                top: 10%;
                right: 10%;
                width: 200px;
                height: 200px;
                background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                animation: lampFlicker 3s ease-in-out infinite alternate;
            `;
            readingRoom.appendChild(lamp);
        }
    }

    // Add CSS animation for lamp flicker
    const style = document.createElement('style');
    style.textContent = `
        @keyframes lampFlicker {
            0% { opacity: 0.8; }
            50% { opacity: 0.6; }
            100% { opacity: 0.9; }
        }
        
        .book-spine:nth-child(even) {
            animation-delay: 0.1s;
        }
        
        .book-spine:nth-child(odd) {
            animation-delay: 0.2s;
        }
    `;
    document.head.appendChild(style);

    addReadingLampEffect();

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape key to close modal
        if (e.key === 'Escape' && documentModal.style.display === 'block') {
            closeDocumentModal();
        }
        
        // Ctrl/Cmd + F to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f' && searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });
});/* Force redeployment Tue Oct  7 18:51:48 EDT 2025 */
