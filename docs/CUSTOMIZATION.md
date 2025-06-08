# Customization Guide

## Changing Header and Footer Images

### Method 1: Update Image URLs

Edit `renderer.js` and change these constants:

```javascript
const HEADER_IMG_URL = 'https://your-domain.com/header.png';
const FOOTER_IMG_URL = 'https://your-domain.com/footer.png';
```

### Method 2: Use Local Images

1. Create an `assets/images/` folder
2. Place your images there
3. Update the URLs:

```javascript
const HEADER_IMG_URL = 'assets/images/header.png';
const FOOTER_IMG_URL = 'assets/images/footer.png';
```

## Modifying Page Layout

### Page Size

To change from A4 to Letter size:

```css
.simulated-a4-page {
    width: 8.5in;    /* was 210mm */
    height: 11in;    /* was 297mm */
}
```

### Content Margins

```css
.content-area {
    padding: 0 2rem;  /* Adjust left/right padding */
    /* or */
    padding: 1in;     /* Equal padding all sides */
}
```

## Styling Customization

### Corporate Colors

Add to `styles.css`:

```css
:root {
    --primary-color: #003366;
    --secondary-color: #0066cc;
    --accent-color: #ff6600;
}

.ca-section-title {
    color: var(--primary-color);
    border-bottom-color: var(--accent-color);
}
```

### Custom Fonts

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
    font-family: 'Roboto', sans-serif;
}
```

## Adding New Components

### Progress Indicators

```css
.progress-bar {
    width: 100%;
    height: 20px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    margin: 1rem 0;
}

.progress-fill {
    height: 100%;
    background-color: #4CAF50;
    text-align: center;
    line-height: 20px;
    color: white;
}
```

```html
<div class="progress-bar">
    <div class="progress-fill" style="width: 75%">75%</div>
</div>
```

### Alert Boxes

```css
.alert {
    padding: 1rem;
    margin: 1rem 0;
    border: 1px solid transparent;
    border-radius: 0.25rem;
}

.alert-warning {
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeaa7;
}

.alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
}
```

## Advanced Customization

### Custom Pagination Logic

To split tables across pages:

```javascript
// In processNextPage(), add special handling:
if (currentElement.tagName === 'TABLE') {
    // Custom table splitting logic
    handleTablePagination(currentElement, contentArea, availableHeight);
}
```

### Dynamic Content Loading

```javascript
// Load content from external source
async function loadContent() {
    const response = await fetch('content.json');
    const data = await response.json();
    
    // Generate HTML from data
    const html = generateHTML(data);
    document.getElementById('raw-content-source').innerHTML = html;
}
```

### Multiple Document Templates

```javascript
// Template selector
const templates = {
    'capital': 'templates/capital-application.html',
    'report': 'templates/technical-report.html',
    'proposal': 'templates/project-proposal.html'
};

function loadTemplate(templateName) {
    fetch(templates[templateName])
        .then(response => response.text())
        .then(html => {
            document.getElementById('raw-content-source').innerHTML = html;
        });
}
```

## Integration Examples

### With React

```jsx
function CapitalApplicationRenderer({ content }) {
    useEffect(() => {
        document.getElementById('raw-content-source').innerHTML = content;
    }, [content]);
    
    return (
        <div>
            <div id="controls">...</div>
            <div id="raw-content-source" className="hidden" />
            <div id="preview-container" />
        </div>
    );
}
```

### With Data Binding

```javascript
// Using template literals
function renderContent(data) {
    return `
        <h2 class="ca-section-title">${data.title}</h2>
        <table class="ca-table">
            ${data.items.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.value}</td>
                </tr>
            `).join('')}
        </table>
    `;
}
```