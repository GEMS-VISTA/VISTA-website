// Timeline page interactions
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
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate progress bar when it comes into view
                if (entry.target.classList.contains('progress-indicator')) {
                    const progressFill = entry.target.querySelector('.progress-fill');
                    if (progressFill) {
                        setTimeout(() => {
                            progressFill.style.width = '15%';
                        }, 200);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe all event cards
    document.querySelectorAll('.event-card, .progress-indicator').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Animate year numbers on scroll
    const yearNumbers = document.querySelectorAll('.year-number');
    const yearObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-100px 0px'
    });
    
    yearNumbers.forEach(year => {
        yearObserver.observe(year);
    });
    
    // Add staggered animation delay to milestones
    document.querySelectorAll('.event-card').forEach((card, cardIndex) => {
        card.querySelectorAll('.milestone').forEach((milestone, index) => {
            milestone.style.opacity = '0';
            milestone.style.transform = 'translateX(-20px)';
            milestone.style.transition = 'all 0.5s ease';
            milestone.style.transitionDelay = `${(cardIndex * 0.1) + (index * 0.1)}s`;
            
            const milestoneObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }
                });
            }, observerOptions);
            
            milestoneObserver.observe(milestone);
        });
    });
    
    // Calculate current progress based on today's date
    const today = new Date();
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2027-05-31');
    
    const totalDuration = endDate - startDate;
    const elapsed = today - startDate;
    const percentComplete = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    
    // Update progress bar if we're within the timeline period
    if (today >= startDate && today <= endDate) {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            setTimeout(() => {
                progressFill.style.width = `${percentComplete}%`;
            }, 1000);
        }
    }
    
    // Zoom-out view animation
    const overviewSection = document.querySelector('.timeline-overview');
    if (overviewSection) {
        const overviewObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        overviewObserver.observe(overviewSection);
    }
});