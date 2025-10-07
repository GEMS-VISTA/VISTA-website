// Technology page interactions
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
    
    // Smooth scroll to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
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
    document.querySelectorAll('.interface-detail').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `all 0.8s ease ${index * 0.2}s`;
        observer.observe(section);
    });
    
    // Animate tech categories within each section
    document.querySelectorAll('.tech-category').forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateX(-20px)';
        category.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(category);
    });
    
    // Animate architecture layers with special effect
    document.querySelectorAll('.arch-layer').forEach((layer, index) => {
        layer.style.opacity = '0';
        layer.style.transform = 'scale(0.9) translateY(20px)';
        layer.style.transition = `all 0.7s ease ${index * 0.15}s`;
        observer.observe(layer);
    });
    
    // Animate team member tags
    document.querySelectorAll('.member-tag').forEach((tag, index) => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(10px)';
        tag.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(tag);
    });
    
    // Animate interface numbers with bounce effect
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
                entry.target.classList.add('bounce');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.interface-number').forEach(number => {
        number.style.opacity = '0';
        number.style.transform = 'scale(0.5)';
        number.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        numberObserver.observe(number);
    });
});