document.addEventListener('DOMContentLoaded', () => {
    const renderButton = document.getElementById('renderButton');
    const printButton = document.querySelector('#controls button:last-of-type');
    const statusEl = document.getElementById('status');
    const sourceContainer = document.getElementById('raw-content-source');
    const previewContainer = document.getElementById('preview-container');

    const HEADER_IMG_URL = 'https://i.imgur.com/OZDMOUw.png';
    const FOOTER_IMG_URL = 'https://i.imgur.com/mQUgEnh.png';

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
    headerImg.onerror = () => { statusEl.textContent = 'Error loading header image.'; };
    footerImg.onerror = () => { statusEl.textContent = 'Error loading footer image.'; };
    headerImg.src = HEADER_IMG_URL;
    footerImg.src = FOOTER_IMG_URL;


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
        
        // Get a flat list of all individual elements to be rendered
        const sourceElements = Array.from(sourceContainer.children).flatMap(el => {
            // If element is a special container, get its children, otherwise get the element itself
            if (el.classList.contains('executive-summary-content')) {
                return Array.from(el.children);
            }
            return [el];
        });

        let elementIndex = 0;

        function processNextPage() {
            if (elementIndex >= sourceElements.length) return; // All done

            const page = document.createElement('div');
            page.className = 'simulated-a4-page';
            
            const header = document.createElement('img');
            header.src = HEADER_IMG_URL;
            header.className = 'header-image-full';
            page.appendChild(header);

            const contentArea = document.createElement('div');
            contentArea.className = 'content-area';
            page.appendChild(contentArea);
            previewContainer.appendChild(page);

            // Must calculate available height AFTER the page is in the DOM
            const headerHeight = page.querySelector('.header-image-full').offsetHeight;
            const footerHeight = footerImg.height * (page.offsetWidth / footerImg.width); 
            const pageHeightInPx = page.offsetHeight;
            const availableContentHeight = pageHeightInPx - headerHeight - footerHeight - 1; 

            contentArea.style.height = `${availableContentHeight}px`;
            contentArea.style.maxHeight = `${availableContentHeight}px`;

            while (elementIndex < sourceElements.length) {
                const currentElement = sourceElements[elementIndex];
                
                const elementClone = currentElement.cloneNode(true);
                contentArea.appendChild(elementClone);

                // Check for overflow
                if (contentArea.scrollHeight > availableContentHeight) {
                    // It overflowed. Remove it and break the loop for this page.
                    contentArea.removeChild(elementClone);
                    // Do NOT increment elementIndex. The next page will start with this element.
                    break; 
                }
                // If it fit, we can move to the next element.
                elementIndex++;
            }
            
            const footer = document.createElement('img');
            footer.src = FOOTER_IMG_URL;
            footer.className = 'footer-image-full';
            page.appendChild(footer);

            // If there are still elements left, process the next page
            if (elementIndex < sourceElements.length) {
                processNextPage();
            }
        }

        if(sourceElements.length > 0) {
             processNextPage();
        }
    }
});