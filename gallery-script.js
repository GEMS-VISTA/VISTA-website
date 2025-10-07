// Gallery page interactions and carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Carousel functionality
    class GalleryCarousel {
        constructor() {
            this.currentSlide = 0;
            this.slides = document.querySelectorAll('.carousel-slide');
            this.prevBtn = document.getElementById('prevBtn');
            this.nextBtn = document.getElementById('nextBtn');
            this.indicatorsContainer = document.getElementById('carouselIndicators');
            this.thumbnailGrid = document.getElementById('thumbnailGrid');
            this.filterBtns = document.querySelectorAll('.filter-btn');
            
            this.allSlides = Array.from(this.slides);
            this.filteredSlides = [...this.allSlides];
            
            this.init();
        }

        init() {
            this.createIndicators();
            this.createThumbnails();
            this.bindEvents();
            this.showSlide(0);
            this.startAutoplay();
        }

        createIndicators() {
            this.indicatorsContainer.innerHTML = '';
            this.filteredSlides.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                indicator.addEventListener('click', () => this.goToSlide(index));
                this.indicatorsContainer.appendChild(indicator);
            });
        }

        createThumbnails() {
            this.thumbnailGrid.innerHTML = '';
            this.filteredSlides.forEach((slide, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'thumbnail';
                
                const videoElement = slide.querySelector('video');
                const imageElement = slide.querySelector('img');
                
                if (videoElement) {
                    const thumbVideo = document.createElement('video');
                    thumbVideo.src = videoElement.src;
                    thumbVideo.muted = true;
                    thumbVideo.preload = 'metadata';
                    thumbnail.appendChild(thumbVideo);
                } else if (imageElement) {
                    const thumbImg = document.createElement('img');
                    thumbImg.src = imageElement.src;
                    thumbImg.alt = imageElement.alt;
                    thumbnail.appendChild(thumbImg);
                }
                
                thumbnail.addEventListener('click', () => this.goToSlide(index));
                this.thumbnailGrid.appendChild(thumbnail);
            });
        }

        bindEvents() {
            // Navigation buttons
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            });

            // Filter buttons
            this.filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.filterSlides(btn.dataset.filter);
                });
            });

            // Touch/swipe support
            this.addTouchSupport();
            
            // Pause autoplay on hover
            const carouselWrapper = document.querySelector('.carousel-wrapper');
            if (carouselWrapper) {
                carouselWrapper.addEventListener('mouseenter', () => this.pauseAutoplay());
                carouselWrapper.addEventListener('mouseleave', () => this.startAutoplay());
            }
        }

        addTouchSupport() {
            const carousel = document.querySelector('.carousel-slides');
            if (!carousel) return;
            
            let startX = 0;
            let endX = 0;

            carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            carousel.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                
                if (Math.abs(diff) > 50) { // Minimum swipe distance
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            });
        }

        filterSlides(filter) {
            // Reset all slides
            this.allSlides.forEach(slide => {
                slide.style.display = 'none';
                slide.classList.remove('active');
            });

            // Filter slides based on category
            if (filter === 'all') {
                this.filteredSlides = [...this.allSlides];
            } else {
                this.filteredSlides = this.allSlides.filter(slide => {
                    const categories = slide.dataset.category.split(' ');
                    return categories.includes(filter);
                });
            }

            // Show filtered slides
            this.filteredSlides.forEach(slide => {
                slide.style.display = 'block';
            });

            // Reset carousel
            this.currentSlide = 0;
            this.createIndicators();
            this.createThumbnails();
            this.showSlide(0);
        }

        showSlide(index) {
            // Remove active class from all slides
            this.filteredSlides.forEach(slide => {
                slide.classList.remove('active', 'prev');
            });

            // Remove active class from all indicators
            const indicators = document.querySelectorAll('.indicator');
            indicators.forEach(indicator => indicator.classList.remove('active'));

            // Remove active class from all thumbnails
            const thumbnails = document.querySelectorAll('.thumbnail');
            thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));

            // Show current slide
            if (this.filteredSlides[index]) {
                this.filteredSlides[index].classList.add('active');
                
                // Pause all videos first
                this.pauseAllVideos();
                
                // Setup video for current slide
                const currentVideo = this.filteredSlides[index].querySelector('video');
                if (currentVideo) {
                    currentVideo.currentTime = 0; // Reset video to beginning
                }
            }

            // Update indicators
            if (indicators[index]) {
                indicators[index].classList.add('active');
            }

            // Update thumbnails
            if (thumbnails[index]) {
                thumbnails[index].classList.add('active');
                // Remove auto-scrolling behavior
            }

            this.currentSlide = index;
        }

        pauseAllVideos() {
            const allVideos = document.querySelectorAll('.carousel-slide video');
            const allContainers = document.querySelectorAll('.video-container');
            
            allVideos.forEach(video => {
                video.pause();
                video.controls = false; // Hide controls when paused
                video.currentTime = 0; // Reset to beginning
            });
            
            allContainers.forEach(container => {
                container.classList.remove('playing'); // Reset playing state
            });
        }

        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.filteredSlides.length;
            this.goToSlide(nextIndex);
        }

        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.filteredSlides.length) % this.filteredSlides.length;
            this.goToSlide(prevIndex);
        }

        goToSlide(index) {
            if (index >= 0 && index < this.filteredSlides.length) {
                this.showSlide(index);
            }
        }

        startAutoplay() {
            this.pauseAutoplay(); // Clear any existing interval
            this.autoplayInterval = setInterval(() => {
                // Only autoplay if no video is currently playing
                const currentSlide = this.filteredSlides[this.currentSlide];
                const currentVideo = currentSlide?.querySelector('video');
                
                if (!currentVideo || currentVideo.paused) {
                    this.nextSlide();
                }
            }, 8000); // 8 seconds per slide
        }

        pauseAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        }
    }

    // Initialize carousel
    const carousel = new GalleryCarousel();

    // Simple Video Control System
    const videoContainers = document.querySelectorAll('.video-container');
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        if (!video) return;

        // Start without controls
        video.removeAttribute('controls');

        // Handle play state
        video.addEventListener('play', () => {
            container.classList.add('playing');
            video.controls = true; // Show controls when playing
            carousel.pauseAutoplay();
        });

        video.addEventListener('pause', () => {
            carousel.startAutoplay();
        });

        video.addEventListener('ended', () => {
            container.classList.remove('playing');
            video.controls = false; // Hide controls when ended
            video.currentTime = 0; // Reset to beginning
            carousel.startAutoplay();
        });

        // Simple click to play
        container.addEventListener('click', (e) => {
            if (video.paused && !container.classList.contains('playing')) {
                e.stopPropagation();
                video.play();
            }
        });
    });

    // Smooth scroll to sections for anchor links (only for actual anchor links)
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target && this.getAttribute('href') !== '#') {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate elements on scroll (simplified to avoid unwanted scrolling)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Only observe elements that are initially hidden, no auto-scrolling
    document.querySelectorAll('.gallery-description, .thumbnail-gallery, .carousel-container').forEach(el => {
        el.style.opacity = '1'; // Start visible to avoid scrolling
        el.style.transform = 'translateY(0)'; // No initial transform
        el.style.transition = 'all 0.6s ease';
        // Remove observer to prevent any scroll triggering
    });

    // Keyboard accessibility improvements
    document.addEventListener('keydown', (e) => {
        // Space bar to play/pause current video
        if (e.code === 'Space' && !e.target.matches('input, textarea, button')) {
            e.preventDefault();
            const currentSlide = carousel.filteredSlides[carousel.currentSlide];
            const video = currentSlide?.querySelector('video');
            const container = currentSlide?.querySelector('.video-container');
            
            if (video && container) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        }
    });

    // Performance optimization: Lazy load videos
    const lazyVideos = document.querySelectorAll('video[data-src]');
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    video.src = video.dataset.src;
                    video.load();
                    videoObserver.unobserve(video);
                }
            });
        });

        lazyVideos.forEach(video => {
            videoObserver.observe(video);
        });
    }
});