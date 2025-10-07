// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNav);

// Navbar background on scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Here you would typically send the form data to a server
    // For now, we'll just show an alert
    alert(`Thank you for your message, ${formData.name}! We'll get back to you soon at ${formData.email}.`);
    
    // Reset form
    contactForm.reset();
});

// Enhanced scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Animate hero section
document.addEventListener('DOMContentLoaded', function() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        heroContent.style.transition = 'all 1s ease 0.3s';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }
    
    // Animate main sections with staggered delay
    document.querySelectorAll('.about, .team, .contact').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = `all 0.8s ease ${index * 0.2}s`;
        observer.observe(section);
    });
    
    // Animate team members with different directions
    document.querySelectorAll('.team-member').forEach((member, index) => {
        const direction = index % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
        member.style.opacity = '0';
        member.style.transform = direction;
        member.style.transition = `all 0.7s ease ${index * 0.15}s`;
        observer.observe(member);
    });
    
    // Animate project cards with scale effect
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9) translateY(20px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Animate timeline items
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s ease ${index * 0.2}s`;
        observer.observe(item);
    });
    
    // Animate contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.style.opacity = '0';
        contactForm.style.transform = 'translateY(30px)';
        contactForm.style.transition = 'all 0.8s ease';
        observer.observe(contactForm);
    }
    
    // Animate navigation items on load
    document.querySelectorAll('.nav-link').forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-10px)';
        link.style.transition = `all 0.5s ease ${index * 0.1 + 0.5}s`;
        
        setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, (index * 100) + 500);
    });
});

// Add CSS for enhanced animations
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary);
        position: relative;
    }
    
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary);
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from { width: 0; }
        to { width: 100%; }
    }
    
    .team-member.animated,
    .project-card.animated {
        transform: translateY(0) translateX(0) scale(1) !important;
    }
    
    .hero-content.animated {
        animation: heroFadeIn 1.2s ease forwards;
    }
    
    @keyframes heroFadeIn {
        0% {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;
document.head.appendChild(style);

// Lazy loading for images (if you add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add typing effect to hero title (optional enhancement)
const heroTitle = document.querySelector('.hero-title');
const titleText = heroTitle.textContent;
heroTitle.textContent = '';
let index = 0;

function typeText() {
    if (index < titleText.length) {
        heroTitle.textContent += titleText.charAt(index);
        index++;
        setTimeout(typeText, 100);
    }
}

// Start typing effect when page loads
window.addEventListener('load', () => {
    setTimeout(typeText, 500);
});

// Console message for developers
console.log('%c Team VISTA ', 'background: #e21833; color: #ffd200; font-size: 20px; padding: 10px;');
console.log('%c Virtual Interactive STEM Teaching Aid ', 'color: #e21833; font-size: 14px;');
console.log('Transforming STEM Education Through Virtual Physical Labs');
console.log('Learn more at: https://github.com/GEMS-VISTA');