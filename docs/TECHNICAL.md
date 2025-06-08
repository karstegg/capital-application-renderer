# Technical Documentation

## Architecture Overview

The Capital Application Renderer is a client-side web application that uses:
- HTML5 for structure
- CSS3 for styling and print optimization
- Vanilla JavaScript for pagination logic
- Tailwind CSS for utility classes

## Core Components

### 1. HTML Structure

```html
<div id="controls">          <!-- Control panel -->
<div id="raw-content-source"> <!-- Source content (hidden) -->
<div id="preview-container">  <!-- Rendered pages appear here -->
```

### 2. Pagination Algorithm

The `paginateContent()` function:
1. Clears previous render
2. Extracts all child elements from source
3. Creates new A4 pages as needed
4. Calculates available content height
5. Adds elements until overflow detected
6. Moves overflowing elements to next page

```javascript
function processNextPage() {
    // Create page structure
    // Add header
    // Fill with content until overflow
    // Add footer
    // Recurse if more content
}
```

### 3. Image Preloading

Header and footer images are preloaded before rendering:
- Ensures accurate height calculations
- Prevents layout shifts
- Shows loading status to user

### 4. Print Optimization

CSS `@media print` rules:
- Hide control panel
- Remove page shadows
- Set proper page breaks
- Ensure white background

## Key Functions

### `onImageLoad()`
Tracks image loading progress and enables render button when ready.

### `paginateContent()`
Main pagination logic that splits content across pages.

### `processNextPage()`
Recursive function that creates individual pages.

## Browser APIs Used

- `cloneNode()` - Duplicates elements for pagination
- `scrollHeight` - Detects content overflow
- `offsetHeight` - Calculates element dimensions
- `window.print()` - Triggers print dialog

## Performance Considerations

- Elements are cloned, not moved (preserves source)
- Pagination runs asynchronously with setTimeout
- Images cached after first load
- Minimal DOM manipulation during render

## Customization Points

1. **Header/Footer Images**: Update URLs in `renderer.js`
2. **Page Margins**: Modify `.content-area` padding
3. **Page Size**: Adjust `.simulated-a4-page` dimensions
4. **Styling**: Edit `styles.css` or add new classes