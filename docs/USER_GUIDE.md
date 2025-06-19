# User Guide

This guide explains how to use the Capital Application Renderer to generate and print documents.

## Generating a Document Preview

1.  **Open `index.html`**: Open the `index.html` file in a modern web browser (like Chrome, Firefox, or Edge).
2.  **Click "Generate Document Preview"**: Click the main button in the control bar at the top of the page.
3.  **Wait for Rendering**: The script will process the content and display it in a series of simulated A4 pages below the control bar. The status text will update to show how many pages were generated.

The renderer automatically handles page breaks, ensuring that content flows correctly from one page to the next. It also includes logic to prevent headings from being left alone at the bottom of a page, providing a more professional layout.

## Printing the Document

1.  **Generate the Preview**: You must first generate the document preview as described above. The "Print" button will be disabled until the preview is ready.
2.  **Click "Print"**: Once the preview is generated, click the "Print" button.
3.  **Use Browser's Print Dialog**: Your browser's standard print dialog will appear.
    -   **Destination**: Choose your desired printer or "Save as PDF".
    -   **Layout**: Ensure it is set to "Portrait".
    -   **Paper Size**: Ensure it is set to "A4".
    -   **Margins**: Set to "Default" or "None". The page styles include appropriate margins.
    -   **Options**: Make sure "Headers and footers" (the browser's own) are turned **off**, and "Background graphics" are turned **on** to ensure the header/footer images and any table shading are printed correctly.
4.  **Print or Save**: Click the final "Print" or "Save" button in the dialog.

## Troubleshooting

-   **Content Not Displaying Correctly**: Ensure the raw HTML content in `index.html` (inside `<div id="raw-content-source">`) is well-formed.
-   **Images Not Loading**: Check that the image paths in `renderer.js` are correct and that the image files exist.
-   **Awkward Page Breaks**: If a heading is still being orphaned, you may need to add its text to the `STICKY_HEADINGS` list in `renderer.js`. See the `CUSTOMIZATION.md` guide for details.