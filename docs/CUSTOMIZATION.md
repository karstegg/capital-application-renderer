# Customization Guide

This guide covers common ways to customize the Capital Application Renderer to fit your specific needs.

## Changing Header and Footer Images

The easiest way to change the header and footer is to replace the `Header.png` and `Footer.png` files in the `assets/images/` directory with your own images of the same name.

Alternatively, you can edit `renderer.js` and change the paths in these constants:

```javascript
const HEADER_IMG_URL = 'assets/images/your-header.png';
const FOOTER_IMG_URL = 'assets/images/your-footer.png';
```

## Controlling Page Breaks for Headings

To prevent a heading from being left alone at the bottom of a page (an "orphan"), the renderer uses a "keep with next" rule. This is controlled by a list of "sticky" heading texts.

### How to Customize Sticky Headings

1.  **Open `renderer.js`**: Navigate to the `paginateContent()` function.
2.  **Find the `STICKY_HEADINGS` array**: You will find an array defined like this:

    ```javascript
    const STICKY_HEADINGS = [
        "EXECUTIVE SUMMARY",
        "BUDGET SUMMARY",
        "PART B – QUALITY ASSURANCE",
        // ... more headings
    ];
    ```

3.  **Add or Remove Headings**:
    -   To make a new heading "sticky", add its exact text as a new string to this array.
    -   The comparison is **case-insensitive**, but it's best practice to match the case in the document.
    -   The text must be an exact match to the heading's text content.

    **Example**: If you have a new section called "Project Risks" that you want to keep with its content, you would add it to the array:

    ```javascript
    const STICKY_HEADINGS = [
        "EXECUTIVE SUMMARY",
        "BUDGET SUMMARY",
        "PROJECT RISKS", // <-- Add your new heading here
        // ... more headings
    ];
    ```

## Modifying Page Layout

All layout styles are in `styles.css`.

### Page Size

To change from A4 to a different size (e.g., Letter):

```css
/* In styles.css */
.simulated-a4-page {
    width: 8.5in;    /* was 210mm */
    height: 11in;    /* was 297mm */
}
```

### Content Margins

The content area padding is set on the `.content-area` class.

```css
/* In styles.css */
.content-area {
    padding: 0 3.25rem;  /* Adjust left/right padding */
}
```

## Customizing Styles

You can override any style in `styles.css`.

### Corporate Colors

A good practice is to define CSS variables for your corporate colors at the top of `styles.css`.

```css
/* In styles.css */
:root {
    --primary-color: #003366;
    --accent-color: #ff6600;
}

.ca-section-title {
    color: var(--primary-color);
    border-bottom-color: var(--accent-color);
}
```

### Custom Fonts

You can import web fonts (like Google Fonts) at the top of `styles.css` and apply them to the `body` or specific elements.

```css
/* In styles.css */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
    font-family: 'Roboto', sans-serif;
}
```