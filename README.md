# Capital Application Renderer

A client-side JavaScript application to dynamically render professional, multi-page capital application forms or similar documents into a paginated, print-ready A4 format.

![Screenshot of the Capital Application Renderer](https://user-images.githubusercontent.com/12345/67890.png) <!-- Placeholder image -->

## Key Features

- **Dynamic Pagination**: Automatically splits long HTML content across multiple simulated A4 pages.
- **Header & Footer Support**: Consistently applies full-width header and footer images to each page.
- **Intelligent List Splitting**: Prevents large lists from causing awkward page breaks by splitting them item by item.
- **Orphan Heading Control**: Implements a "keep with next" rule to ensure headings are not left stranded at the bottom of a page.
- **Artifact Removal**: Automatically cleans up known conversion artifacts (like empty comment boxes) before rendering.
- **Print-Ready Output**: Generates a clean, professional layout optimized for printing.
- **Zero Dependencies**: Built with vanilla JavaScript, requiring no external frameworks.
- **Easy to Customize**: Styles, layout, and pagination rules can be easily modified.

## Project Structure

```
capital-application-renderer/
├── index.html            # Main HTML file with content source
├── renderer.js           # Core pagination and rendering logic
├── styles.css            # Custom styles for layout and components
├── README.md             # This file
├── docs/                 # Detailed documentation
│   ├── USER_GUIDE.md     # User guide
│   ├── TECHNICAL.md      # Technical documentation
│   └── CUSTOMIZATION.md  # Customization guide
├── examples/             # Example content templates
│   ├── basic.html       # Basic capital application
│   ├── complex.html     # Complex multi-page application
│   └── custom.html      # Custom styling example
└── assets/               # Asset files
    └── images/          # Header/footer images
```

## How It Works

1.  **Content Source**: All raw HTML for the document is placed within a hidden `<div id="raw-content-source">` in `index.html`.
2.  **Pre-processing**: Before pagination, `renderer.js` automatically removes known HTML artifacts (e.g., empty `div.comments-box` elements) that can cause spacing issues.
3.  **Dynamic Pagination**: The script iteratively adds elements to a simulated A4 page, constantly measuring the content height.
4.  **Overflow Management**: When an element is too large to fit on the current page, it's moved to the next. The script can intelligently split `<ul>` and `<ol>` lists, moving one list item at a time to prevent awkward breaks.
5.  **Orphan Heading Control**: After a page is filled, the script checks if the last element is a "sticky" heading (defined in the `STICKY_HEADINGS` array in `renderer.js`). If it is, and there is more content to follow, the heading is moved to the top of the next page to keep it with its content.
6.  **Print Optimization**: Standard CSS media queries hide UI elements (like the "Generate" button) and optimize the layout for physical printing.

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Not supported

## Deployment Options

### GitHub Pages
1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Access at: `https://[username].github.io/capital-application-renderer/`

### Static Hosting
Upload files to any static hosting service (Netlify, Vercel, AWS S3, etc.)

### Corporate Intranet
Copy files to your internal web server - no build process required.

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation in the `docs/` folder