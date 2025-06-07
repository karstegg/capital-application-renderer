# Capital Application Document Renderer

A dynamic page renderer for capital application documents that simulates A4 pages with automatic pagination, header/footer images, and print-ready formatting.

## Features

- **Dynamic A4 Page Simulation**: Renders content into properly sized A4 pages (210mm x 297mm)
- **Automatic Pagination**: Intelligently splits content across pages without breaking elements
- **Header/Footer Support**: Includes branded header and footer images on each page
- **Print-Ready**: Optimized CSS for clean printing without UI elements
- **Responsive Preview**: View multiple pages in a scrollable container
- **Real-time Rendering**: Generate document preview on demand

## Quick Start

### Option 1: Use the hosted version
Visit: https://karstegg.github.io/capital-application-renderer/

### Option 2: Run locally
1. Clone the repository
2. Open `index.html` in a web browser
3. Click "Generate Document Preview"
4. Use the Print button or Ctrl+P to print/save as PDF

## Project Structure

```
capital-application-renderer/
├── index.html              # Main application file
├── README.md              # This file
├── docs/                  # Documentation
│   ├── USER_GUIDE.md     # User guide
│   ├── TECHNICAL.md      # Technical documentation
│   └── CUSTOMIZATION.md  # Customization guide
├── examples/             # Example content templates
│   ├── basic.html       # Basic capital application
│   ├── complex.html     # Complex multi-page application
│   └── custom.html      # Custom styling example
└── assets/              # Asset files
    └── images/          # Header/footer images
```

## Key Technologies

- **HTML5**: Structure and content
- **Tailwind CSS**: Utility-first styling (via CDN)
- **Vanilla JavaScript**: No framework dependencies
- **CSS Print Media**: Print-specific optimizations

## How It Works

1. **Content Source**: Raw HTML content is stored in a hidden container
2. **Image Preloading**: Header/footer images are loaded before rendering
3. **Dynamic Pagination**: JavaScript calculates available space and splits content
4. **Overflow Detection**: Elements that don't fit are moved to the next page
5. **Print Optimization**: CSS media queries hide UI elements when printing

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
Copy files to your internal web server - no build process required

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