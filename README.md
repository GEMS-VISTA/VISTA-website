# GEMS-VISTA Team Website

Welcome to the GEMS-VISTA team website repository! This website serves as the public-facing information hub for our research team working on Virtual Interactive STEM Teaching AIDs.

## About GEMS-VISTA

GEMS-VISTA is a research team within the University of Maryland's Gemstone Honors Program (Cohort 2027). We are developing innovative virtual remote laboratories to enhance STEM education accessibility and engagement.

## Website Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design using UMD brand colors
- **Interactive Elements**: Smooth scrolling, mobile navigation, and form handling
- **Easy to Maintain**: Simple HTML/CSS/JS structure with no framework dependencies

## Quick Start

### Viewing Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/GEMS-VISTA/gems-vista-website.git
   cd gems-vista-website
   ```

2. Open `index.html` in your web browser:
   - On Mac: `open index.html`
   - On Windows: `start index.html`
   - On Linux: `xdg-open index.html`

### Deploying with GitHub Pages

1. Go to repository Settings on GitHub
2. Navigate to Pages section
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click Save
6. Your site will be available at: `https://gems-vista.github.io/gems-vista-website/`

## Making Edits

### Updating Team Members

Edit the team section in `index.html` (lines ~150-190):

```html
<div class="team-member">
    <div class="member-image">
        <img src="path/to/photo.jpg" alt="Member Name">
    </div>
    <h3>Member Name</h3>
    <p class="member-role">Role/Title</p>
    <p class="member-bio">Brief bio here...</p>
</div>
```

### Adding Projects

Edit the projects section in `index.html` (lines ~200-250):

```html
<div class="project-card">
    <div class="project-icon">🔬</div>
    <h3>Project Title</h3>
    <p>Project description...</p>
    <div class="project-tags">
        <span class="tag">Technology</span>
        <span class="tag">Field</span>
    </div>
</div>
```

### Updating Timeline

Edit the milestones section in `index.html` (lines ~260-310):

```html
<div class="timeline-item">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
        <h4>Milestone Title</h4>
        <p class="timeline-date">Date</p>
        <p>Description...</p>
    </div>
</div>
```

### Changing Colors

Edit the CSS variables in `styles.css` (lines 1-15):

```css
:root {
    --umd-red: #e21833;     /* Primary red color */
    --umd-gold: #ffd200;    /* Accent gold color */
    --text-dark: #1a1a1a;   /* Main text color */
    /* ... other colors ... */
}
```

### Contact Form

The contact form currently shows an alert when submitted. To connect it to a real backend:

1. Edit `script.js` (lines ~90-105)
2. Replace the alert with an API call to your backend:

```javascript
// Replace this:
alert(`Thank you for your message...`);

// With something like:
fetch('https://your-api.com/contact', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    alert('Message sent successfully!');
    contactForm.reset();
});
```

## File Structure

```
gems-vista-website/
├── index.html       # Main HTML file with all content
├── styles.css       # All styling and responsive design
├── script.js        # JavaScript for interactivity
└── README.md        # This file
```

## Adding Images

1. Create an `images` folder in the root directory
2. Add your images there
3. Reference them in HTML: `<img src="images/filename.jpg" alt="Description">`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Tips for Team Members

1. **Before making changes**: Always pull the latest version
   ```bash
   git pull origin main
   ```

2. **After making changes**: Commit with clear messages
   ```bash
   git add .
   git commit -m "Update: Added new team member profile"
   git push origin main
   ```

3. **Testing**: Always test your changes on different screen sizes using browser dev tools

4. **Images**: Optimize images before uploading (use tools like TinyPNG)

5. **Content**: Keep descriptions concise and professional

## Need Help?

- HTML/CSS Reference: [MDN Web Docs](https://developer.mozilla.org/)
- Markdown Guide: [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
- Git Help: [GitHub Docs](https://docs.github.com/)

## Contact

For questions about the website, reach out to the team at gemsvista@umd.edu

---

© 2025 Team VISTA | University of Maryland Gemstone Honors Program