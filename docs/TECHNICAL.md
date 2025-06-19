# Technical Documentation

This document provides a technical overview of the Capital Application Renderer, focusing on the core rendering and pagination logic.

## Core Files

-   **`index.html`**: The main entry point. It contains the document's raw HTML content within `<div id="raw-content-source">`. This content is hidden from view and serves as the master template for the renderer.
-   **`renderer.js`**: The heart of the application. This script contains all logic for cloning content, managing pagination, handling page breaks, and controlling the UI.
-   **`styles.css`**: Contains all custom CSS for styling the simulated A4 pages, content elements (titles, tables, etc.), and print-specific rules.

## Pagination Logic (`renderer.js`)

The pagination process is handled by the `paginateContent()` function and its inner helper `processNextPage()`. The process is as follows:

1.  **Initialization**: The main `preview-container` is cleared.
2.  **Content Pre-processing**: Before pagination begins, the script queries the `sourceContainer` for any known HTML artifacts that can cause layout issues (e.g., `<div class="comments-box">`) and removes them from the DOM. This ensures a clean source for pagination.
3.  **Element Processing**: The script iterates through the child elements of the `sourceContainer`.
4.  **Page Creation**: For each new page, a `div.simulated-a4-page` is created, and the header/footer images are added. The available vertical space for content is calculated based on the page height minus the header and footer heights.
5.  **Content Filling Loop**: The script adds one element at a time to the current page's `.content-area` and checks the `scrollHeight`.
    -   If the `scrollHeight` exceeds the available height, the last-added element is removed and pushed back into the queue to be processed on the next page.
6.  **Intelligent List Splitting**: If an element is a list (`<ul>` or `<ol>`), the script doesn't just add the whole list. Instead, it creates a new list container on the page and adds list items (`<li>`) one by one. If a list item causes an overflow, it is removed, and the rest of the list items are processed on the next page. This allows lists to be split cleanly across pages.
7.  **Orphan Heading Control**: After a page is filled with content, a final check is performed:
    -   The script inspects the last element on the page.
    -   It checks if the element's trimmed, uppercase text matches any of the strings in the `STICKY_HEADINGS` array.
    -   If it's a match AND there are still more elements left to process in the main queue, the heading is removed from the current page and moved to the next. This prevents headings from being orphaned at the bottom of a page.
8.  **Completion**: The loop continues until all elements from `sourceContainer` have been placed on a page.

## Key Data Structures

-   **`sourceElements` (Array)**: A flat array of all top-level DOM nodes from the `#raw-content-source` container. This serves as the master queue of content to be paginated.
-   **`STICKY_HEADINGS` (Array of Strings)**: Found in `renderer.js`, this array contains the exact text of headings that should "stick" with the content that follows them. The matching is case-insensitive.

## Styling and Layout

-   **A4 Simulation**: The `.simulated-a4-page` class uses fixed `mm` dimensions to accurately represent an A4 page on screen.
-   **Content Area**: The `.content-area` uses Flexbox (`flex-grow: 1`) to automatically fill the available space between the header and footer. Its `overflow: hidden` property is critical for `scrollHeight` calculations.
-   **Print Styles**: An `@media print` block in `styles.css` overrides screen styles for a clean print output. It hides UI controls, removes shadows, and ensures proper page breaks.