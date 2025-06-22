document.addEventListener('DOMContentLoaded', () => {
    const renderButton = document.getElementById('renderButton');
    const printButton = document.querySelector('#controls button:last-of-type');
    const statusEl = document.getElementById('status');
    const sourceContainer = document.getElementById('raw-content-source');
    const previewContainer = document.getElementById('preview-container');

    const HEADER_IMG_URL = 'assets/images/Header.png';
    const DEFAULT_DOCX_PATH = './Capital Application Form - Out of Plan Caterpillar Backhoe.docx';
    const FOOTER_IMG_URL = 'assets/images/Footer.png';

    const headerImg = new Image();
    const footerImg = new Image();
    let imagesLoaded = 0;
    const totalImages = 2;

    function onImageLoad() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            renderButton.disabled = false;
            statusEl.textContent = 'Ready to generate document.';
        }
    }
    
    statusEl.textContent = 'Loading resources...';
    renderButton.disabled = true;
    headerImg.onload = onImageLoad;
    footerImg.onload = onImageLoad;
    // Ensure button enables even if an image fails to load, to avoid getting stuck
    headerImg.onerror = () => { 
        statusEl.textContent = 'Error loading header image. Check path and ensure file exists.'; 
        imagesLoaded++; // Still count it as 'processed'
        if (imagesLoaded === totalImages) { onImageLoad(); } // Trigger button enable if all processed
    };
    footerImg.onerror = () => { 
        statusEl.textContent = 'Error loading footer image. Check path and ensure file exists.'; 
        imagesLoaded++; // Still count it as 'processed'
        if (imagesLoaded === totalImages) { onImageLoad(); } // Trigger button enable if all processed
    };

    // Use data attributes for preloading if available, otherwise use defaults from renderer.js
    // These resolved paths will also be used by paginateContent
    let actualHeaderSrc = sourceContainer.getAttribute('data-header-image-src');
    if (!actualHeaderSrc) {
        console.warn('Header image data-attribute (data-header-image-src) not found or empty on #raw-content-source, using default from renderer.js:', HEADER_IMG_URL);
        actualHeaderSrc = HEADER_IMG_URL;
    }
    let actualFooterSrc = sourceContainer.getAttribute('data-footer-image-src');
    if (!actualFooterSrc) {
        console.warn('Footer image data-attribute (data-footer-image-src) not found or empty on #raw-content-source, using default from renderer.js:', FOOTER_IMG_URL);
        actualFooterSrc = FOOTER_IMG_URL;
    }

    console.log('[Renderer Preload] Attempting to preload header with resolved path:', actualHeaderSrc);
    console.log('[Renderer Preload] Attempting to preload footer with resolved path:', actualFooterSrc);

    headerImg.src = actualHeaderSrc;
    footerImg.src = actualFooterSrc;


    renderButton.addEventListener('click', () => {
        renderButton.disabled = true;
        printButton.disabled = true;
        statusEl.innerHTML = '<div class="loading-spinner"></div> Rendering...';
        
        setTimeout(() => {
            try {
                paginateContent();
                printButton.disabled = false;
                statusEl.textContent = `Generated ${previewContainer.children.length} pages.`;
            } catch (error) {
                statusEl.textContent = 'An error occurred during rendering.';
                console.error(error);
            } finally {
                renderButton.disabled = false;
            }
        }, 100);
    });

    function paginateContent() {
        previewContainer.innerHTML = '';

        // Remove any 'comments-box' divs from the source content before pagination
        const commentBoxesToRemove = sourceContainer.querySelectorAll('.comments-box');
        commentBoxesToRemove.forEach(box => {
            console.log('[Renderer] Removing comments-box element:', box);
            box.remove(); 
        });
        
        // Get a flat list of all individual elements to be rendered
        const sourceElements = Array.from(sourceContainer.children).flatMap(el => {
            // If element is a special container, get its children, otherwise get the element itself
            if (el.classList.contains('executive-summary-content')) {
                return Array.from(el.children);
            }
            return [el];
        });

        let elementIndex = 0;
        let pageCounter = 0;

        function processNextPage() {
            if (elementIndex >= sourceElements.length) {
                console.log('All elements processed. Pagination complete.');
                if (statusEl) statusEl.textContent = `Generated ${previewContainer.children.length} pages.`;
                if (printButton) printButton.disabled = false;
                return;
            }

            pageCounter++;
            console.log(`Creating page ${pageCounter}`);
            const page = document.createElement('div');
            page.className = 'simulated-a4-page';
            page.id = `page-${pageCounter}`;

            const headerClone = document.createElement('img');
            // headerClone.src = actualHeaderSrc; // Src will be set by imageLoadPromise
            headerClone.className = 'header-image-full';
            page.appendChild(headerClone);

            const contentArea = document.createElement('div');
            contentArea.className = 'content-area';
            page.appendChild(contentArea);

            const footerClone = document.createElement('img');
            // footerClone.src = actualFooterSrc; // Src will be set by imageLoadPromise
            footerClone.className = 'footer-image-full';
            page.appendChild(footerClone);

            previewContainer.appendChild(page); // Add page to DOM early so page.offsetHeight is available if needed by image promise (though not directly used there)

            // Helper function to handle image loading with Promises
            const imageLoadPromise = (imgElement, imgSrc, imgNameForLog, pageNumForLog) => {
                return new Promise((resolve) => { 
                    imgElement.onload = () => {
                        if (imgElement.naturalHeight > 0 && imgElement.naturalWidth > 0) {
                            console.log(`${imgNameForLog} ('${imgSrc}') loaded for page ${pageNumForLog}. Height: ${imgElement.offsetHeight}`);
                            resolve(imgElement.offsetHeight);
                        } else {
                            console.warn(`${imgNameForLog} ('${imgSrc}') loaded but has no dimensions for page ${pageNumForLog}. Using 0 height.`);
                            resolve(0);
                        }
                    };
                    imgElement.onerror = () => {
                        console.error(`${imgNameForLog} ('${imgSrc}') failed to load for page ${pageNumForLog}. Using 0 height.`);
                        resolve(0); 
                    };
                    
                    // Set src to trigger loading AFTER event handlers are attached
                    imgElement.src = imgSrc; 

                    // Check if image is already loaded (e.g. from cache)
                    if (imgElement.complete) {
                        if (imgElement.naturalHeight > 0 && imgElement.naturalWidth > 0) {
                            console.log(`${imgNameForLog} ('${imgSrc}') was already complete for page ${pageNumForLog}. Using offsetHeight: ${imgElement.offsetHeight}`);
                            resolve(imgElement.offsetHeight);
                        } else if (imgElement.naturalHeight === 0 && imgElement.naturalWidth === 0 && imgSrc) { // Check if it's a broken image link that completed
                           console.warn(`${imgNameForLog} ('${imgSrc}') was already complete but seems broken (0x0 dimensions) for page ${pageNumForLog}. Using 0 height.`);
                           resolve(0);
                        } else if (!imgSrc) {
                            console.warn(`${imgNameForLog} has no imgSrc and was complete for page ${pageNumForLog}. Using 0 height.`);
                            resolve(0);
                        }
                        // If it's complete but not yet processed by onload (e.g. race condition), onload should still handle it.
                    }
                });
            };

            Promise.all([
                imageLoadPromise(headerClone, actualHeaderSrc, 'Header', pageCounter),
                imageLoadPromise(footerClone, actualFooterSrc, 'Footer', pageCounter)
            ]).then(([headerActualHeight, footerActualHeight]) => {
                const pageHeightInPx = page.offsetHeight; 
                let availableContentHeight = pageHeightInPx - headerActualHeight - footerActualHeight;
                if (availableContentHeight < 50 && availableContentHeight > 0) { // If very little space, might be due to image load error giving 0 height
                    console.warn(`Page ${pageCounter}: Very small availableContentHeight (${availableContentHeight}px). HeaderH=${headerActualHeight}, FooterH=${footerActualHeight}. This might indicate an issue with header/footer image loading or dimensions.`);
                } else if (availableContentHeight <= 0) {
                    console.warn(`Page ${pageCounter}: No available content height (${availableContentHeight}px). HeaderH=${headerActualHeight}, FooterH=${footerActualHeight}. Setting to a minimal fallback to avoid issues, but check image paths/loading.`);
                    availableContentHeight = 50; // Fallback to a small positive value if calculation is zero or negative
                }
                
                console.log(`Page ${pageCounter}: PageH=${pageHeightInPx}, HeaderH=${headerActualHeight}, FooterH=${footerActualHeight}, AvailableH=${availableContentHeight}`);
                contentArea.style.height = `${availableContentHeight}px`;
                contentArea.style.maxHeight = `${availableContentHeight}px`;
                contentArea.style.overflow = 'hidden';

                let pageHasContent = false;
                let elementsAddedToThisPage = 0;

                while (elementIndex < sourceElements.length && availableContentHeight > 0) {
                    const currentElement = sourceElements[elementIndex];

                    // Check if the element is a list that needs special handling
                    if ((currentElement.tagName === 'UL' || currentElement.tagName === 'OL') && currentElement.children.length > 0) {
                        let listOverflowed = false;
                        const listContainer = document.createElement(currentElement.tagName);
                        listContainer.className = currentElement.className;
                        contentArea.appendChild(listContainer);
                        
                        let itemsProcessed = 0;
                        while (currentElement.children.length > 0) {
                            const listItem = currentElement.children[0]; // Always process the first child
                            const listItemClone = listItem.cloneNode(true);
                            listContainer.appendChild(listItemClone);
                            itemsProcessed++;

                            if (contentArea.scrollHeight > availableContentHeight) {
                                console.log(`Page ${pageCounter}: List item caused overflow. Moving remaining list to next page.`);
                                listContainer.removeChild(listItemClone); // Remove the item that overflowed
                                listOverflowed = true;
                                break; // Exit the inner while loop (processing LIs)
                            }
                            // If it fits, permanently remove it from the source element so it's not re-processed
                            currentElement.removeChild(listItem);
                        }

                        if (listContainer.children.length > 0) {
                            pageHasContent = true;
                            elementsAddedToThisPage++;
                        }

                        // If the original list is now empty, we can move to the next source element
                        if (currentElement.children.length === 0) {
                            elementIndex++;
                        }

                        if (listOverflowed) {
                            break; // Exit the outer while loop to start a new page
                        }

                    } else { // Standard handling for non-list or empty list elements
                        const elementClone = currentElement.cloneNode(true);
                        const currentFilledHeightBeforeAdding = contentArea.scrollHeight;
                        contentArea.appendChild(elementClone);
                        const elementHeight = elementClone.offsetHeight;

                        if (contentArea.scrollHeight > availableContentHeight) {
                            const remainingSpace = availableContentHeight - currentFilledHeightBeforeAdding;
                            console.log(`Page ${pageCounter}: Overflow detected. Element: <${elementClone.tagName}>, Height: ${elementHeight}, FilledBefore: ${currentFilledHeightBeforeAdding}, Available: ${availableContentHeight}, Remaining: ${remainingSpace}`);
                            console.log(`Page ${pageCounter}: Element content causing overflow (first 100 chars): ${elementClone.outerHTML.substring(0, 100)}`);
                            
                            contentArea.removeChild(elementClone);

                            if (elementsAddedToThisPage === 0 && elementHeight > availableContentHeight) {
                                console.warn(`Page ${pageCounter}: Element (tag: ${elementClone.tagName}) is too large for an empty page. Skipping.`);
                                elementIndex++;
                                continue;
                            }
                            break;
                        } else {
                            pageHasContent = true;
                            elementsAddedToThisPage++;
                            elementIndex++;
                        }
                    }
                }
                
                if (elementsAddedToThisPage === 0 && elementIndex < sourceElements.length && availableContentHeight > 0) {
                    const elToSkip = sourceElements[elementIndex];
                    console.warn(`Page ${pageCounter}: No elements added, but content remains. First available element (tag: ${elToSkip.tagName}) might be too large or unprocessable. Skipping element index ${elementIndex} to prevent infinite loop.`);
                    elementIndex++;
                }

                const STICKY_HEADINGS = [
                    "EXECUTIVE SUMMARY",
                    "BUDGET SUMMARY",
                    "CATEGORISATION:",
                    "PART B – QUALITY ASSURANCE",
                    "HEADS OF DEPARTMENTS (HODS) OR SPECIALISTS",
                    "PART C – APPROVALS",
                    "1. PURPOSE",
                    "2. BACKGROUND",
                    "3. PROBLEM STATEMENT",
                    "4. BUSINESS CASE",
                    "BENEFITS:",
                    "BUSINESS DELIVERABLES (KPIS):",
                    "FINANCIAL ANALYSIS",
                    "5. TECHNICAL SUMMARY",
                    "SCOPE OF SUPPLY",
                    "6. OTHER PROJECT CONSIDERATIONS",
                    "8. CONCLUSION AND RECOMMENDATION",
                    "APPENDIX 1 – SUPPORTING DOCUMENTS AS APPLICABLE",
                    "APPENDIX 2 – SPECIFICATIONS, QUOTATIONS, BILLS OF QUANTITIES",
                    "PROJECT MANAGEMENT SUMMARY",
                    "EXECUTION APPROACH",
                    "SCHEDULE",
                    "PROJECT RESOURCES",
                    "OPERATIONAL READINESS REQUIREMENTS",
                    "RISKS",
                    "PART D - MOTIVATION"
                ];

                if (pageHasContent && contentArea.children.length > 0) {
                    // Text-based "keep with next" logic.
                    while (contentArea.children.length > 0) {
                        const lastElementOnPage = contentArea.lastElementChild;
                        let isSticky = false;
                        if (lastElementOnPage && lastElementOnPage.innerText) {
                            const elementText = lastElementOnPage.innerText.trim().toUpperCase();
                            isSticky = STICKY_HEADINGS.includes(elementText);
                        }

                        // If the last element is a sticky heading and there's more content to come, move it.
                        if (isSticky && elementIndex < sourceElements.length) {
                            console.log(`Page ${pageCounter}: Text-based control. Moving sticky heading: "${lastElementOnPage.innerText.trim()}"`);
                            contentArea.removeChild(lastElementOnPage);
                            elementIndex--; // Ensure this element is re-processed on the next page.
                            elementsAddedToThisPage--;
                        } else {
                            // If the last element isn't sticky, we're done with this page.
                            break;
                        }
                    }
                    if (contentArea.children.length === 0) {
                        pageHasContent = false;
                    }
                }
                
                console.log(`Page ${pageCounter}: Content filling complete. Elements on page: ${elementsAddedToThisPage}. Proceeding to next page decision.`);

                if (elementIndex < sourceElements.length) {
                    processNextPage(); 
                } else {
                    console.log('All elements processed. Pagination complete.');
                    if (statusEl) statusEl.textContent = `Generated ${previewContainer.children.length} pages.`;
                    if (printButton) printButton.disabled = false;
                }
            }).catch(error => {
                console.error(`Error during image loading or page processing for page ${pageCounter}:`, error);
                if (elementIndex < sourceElements.length) {
                    console.warn(`Page ${pageCounter}: Attempting to continue pagination despite error.`);
                    processNextPage(); 
                } else {
                    console.log('All elements processed (potentially with errors). Pagination complete.');
                    if (statusEl) statusEl.textContent = `Generated ${previewContainer.children.length} pages (check console for errors).`;
                    if (printButton) printButton.disabled = false;
                }
            });
        }

        if(sourceElements.length > 0) {
             processNextPage();
        }
    }
});