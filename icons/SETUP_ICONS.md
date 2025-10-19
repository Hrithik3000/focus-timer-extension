# Icon Setup Instructions

This Chrome extension requires PNG icons in different sizes. Since we can't generate binary files directly in this repository, please follow these steps to create the required icon files:

## Required Icon Sizes

- `icon16.png` - 16x16 pixels (toolbar)
- `icon32.png` - 32x32 pixels (Windows)
- `icon48.png` - 48x48 pixels (extension management)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## How to Create Icons

### Option 1: Use the SVG file (Recommended)

1. Open the `icon.svg` file in any vector graphics editor (Inkscape, Adobe Illustrator, or online tools)
2. Export as PNG at the required sizes:
   - Export at 16x16 → save as `icon16.png`
   - Export at 32x32 → save as `icon32.png`
   - Export at 48x48 → save as `icon48.png`
   - Export at 128x128 → save as `icon128.png`

### Option 2: Use Online Converters

1. Go to an online SVG to PNG converter (like svgtopng.com)
2. Upload the `icon.svg` file
3. Generate PNGs at each required size
4. Download and rename them appropriately

### Option 3: Use Simple Colored Squares (Quick Setup)

For quick testing, create solid colored PNG files:
- Use any image editor to create solid squares with the gradient colors from the design
- Primary color: #667eea
- Secondary color: #764ba2

## Installation

Once you have the PNG files:

1. Place all PNG files in the `icons/` directory
2. Ensure the filenames match exactly:
   ```
   icons/
   ├── icon16.png
   ├── icon32.png
   ├── icon48.png
   ├── icon128.png
   └── icon.svg
   ```
3. Load the extension in Chrome developer mode

## Note

The extension will work without icons, but they improve the user experience and are required for Chrome Web Store submission.