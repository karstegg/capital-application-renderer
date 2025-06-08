# User Guide

## Getting Started

### Opening the Application
1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, or Edge)
2. The page will load with a control panel at the top and placeholder content

### Basic Usage

1. **Replace Content**: 
   - Edit the HTML file and replace the content inside `<div id="raw-content-source">` with your document
   - Use the provided CSS classes for consistent formatting

2. **Generate Preview**:
   - Click the "Generate Document Preview" button
   - The system will automatically paginate your content across A4 pages
   - Headers and footers will be added to each page

3. **Print or Save as PDF**:
   - Click the "Print" button or use Ctrl+P (Cmd+P on Mac)
   - Choose your printer or "Save as PDF" option
   - The document will print without the control panel

## Content Formatting

### Available CSS Classes

- `.ca-section-title` - Main section headers (uppercase, underlined)
- `.ca-subsection-title` - Subsection headers
- `.ca-text` - Regular paragraph text
- `.ca-italic-note` - Italic notes or disclaimers
- `.ca-table` - Formatted tables with borders
- `.checkbox-container` - Container for checkbox items
- `.comments-box` - Bordered comment areas
- `.signature-block-cell` - Fixed-height cells for signatures

### Tables

```html
<table class="ca-table">
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

### Checkboxes

```html
<div class="checkbox-container">
  <div class="checkbox">✓</div>
  <div class="checkbox-label">Option Text</div>
</div>
```

## Tips

- Keep content concise to avoid unnecessary page breaks
- Test the print preview before final printing
- Use the full example as a template for complex documents
- Headers and footers are automatically added - don't include them in your content