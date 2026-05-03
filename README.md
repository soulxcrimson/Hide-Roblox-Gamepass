# Hide Roblox Offsale Passes

A Chrome extension (Manifest V3) that helps you quickly hide selected offsale game passes on the Roblox Creator Dashboard.

## Features

- ✅ Automatically detects all "Offsale" passes on the passes page
- ✅ **Single toggle button** positioned near the "Create a Pass" button
- ✅ **Persistent state** - remembers your preference across page refreshes
- ✅ **"Hide"** (blue button) - hides all offsale passes
- ✅ **"Show"** (white button) - shows all hidden offsale passes
- ✅ Uses clean, modular vanilla JavaScript (no frameworks)
- ✅ Handles dynamic content with MutationObserver
- ✅ Works on `https://create.roblox.com/dashboard/creations/experiences/*/monetization/passes`

## Installation

### Manual Installation (Development Mode)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Navigate to this project folder and select it
5. The extension will appear in your extensions list

### Using the Project

1. Navigate to the Roblox Creator Dashboard passes page:
   - Go to your game
   - Click "Monetization" → "Passes"
   - The extension will automatically activate

## How to Use

1. **Button Appears**: Once the extension is active, a **"Hide"** button (blue) appears next to the "Create a Pass" button
2. **Hide Offsale Passes**: Click the **"Hide"** button to hide all offsale passes
   - The button changes to **"Show"** (white outline)
   - All passes marked as "Offsale" disappear from the table
   - Your preference is saved and persists across page refreshes
3. **Show Offsale Passes**: Click the **"Show"** button to reveal hidden offsale passes
   - The button changes back to **"Hide"** (blue)
   - All previously hidden offsale passes reappear
   - Your preference is saved

**That's it!** The extension remembers your choice, so offsale passes will stay hidden/shown even after refreshing the page.

## Project Structure

```
hide-roblox-gamepass/
├── manifest.json       # Chrome extension manifest (Manifest V3)
├── content.js          # Main extension logic
├── styles.css          # Button styling
└── README.md           # This file
```

## File Descriptions

### manifest.json
- Defines the extension metadata and permissions
- Specifies which pages the content script runs on
- Permissions: `activeTab`, `scripting`

### content.js
- Scans the passes table for offsale items
- Injects the "Hide Selected Offsale" button
- Handles button clicks and hides selected rows
- Uses MutationObserver to detect dynamic content changes

### styles.css
- Styles for the fixed-position button
- Hover effects and transitions
- Professional appearance matching modern design standards

## Browser Support

- Chrome 88+
- Edge 88+
- Other Chromium-based browsers (tested on Chrome)

## Technical Details

### Content Script Injection
The extension matches URLs like:
- `https://create.roblox.com/dashboard/creations/experiences/7559307919/monetization/passes`
- Works with any experience ID

### Detection Logic
- Scans all table rows (`<tr>` elements)
- Checks for "Offsale" text in row cells
- Automatically detects and hides/shows passes based on saved preference

### Persistence
- Uses `localStorage` to remember hide/show state
- State persists across page refreshes and browser sessions
- Automatically applies saved preference when page loads

### DOM Manipulation
- Hides rows using CSS: `display: none`
- Tracks hidden rows with a CSS class: `offsale-hidden-by-extension`
- Button positioned dynamically near "Create a Pass" button

## Known Limitations

- Hidden rows are only hidden in your browser (data is not deleted)
- Only works on the Roblox Creator Dashboard passes page
- Requires the "Create a Pass" button to be present for optimal positioning

## Troubleshooting

### Buttons not appearing?
1. Ensure you're on the correct Roblox Creator Dashboard passes page
2. Check the browser console for error messages
3. Try refreshing the page
4. Make sure the extension is enabled in chrome://extensions/

### Buttons appear but don't work?
1. Open DevTools console (F12) and check for error messages
2. Verify you're on the passes page (URL should contain `/monetization/passes`)
3. Make sure there are offsale passes on the page to hide

### "Hide All Offsale" hides all passes?
- Check your page URL - it should match the extension's target pattern
- Try refreshing the page to reset

### Enable Developer Console
- Press `F12` or `Ctrl+Shift+I` to open DevTools
- Navigate to the "Console" tab to see extension logs

## Permissions Explained

- **activeTab**: Allows the extension to access the currently active tab
- **scripting**: Allows injecting JavaScript content into the page

## Version History

### v1.2.0
- **Fixed: Refresh persistence** - Offsale passes now stay hidden/shown across page refreshes using localStorage
- **New: Single toggle button** - Replaced dual buttons with one toggle button that changes appearance
- **New: Smart positioning** - Button now appears next to "Create a Pass" button instead of fixed position
- **New: Visual feedback** - Blue "Hide" button when passes are visible, white "Show" button when hidden
- **Improved: User experience** - No more manual selection needed, just one click to toggle
- Added localStorage persistence with key: `hide-offsale-passes-enabled`

### v1.1.0
- Added custom logo support
- Updated manifest.json with icon reference

### v1.0.0
- Initial release
- Dual button functionality for hiding/showing offsale passes

## License

This extension is provided as-is for personal use.

## Support

For issues or feature requests, check the console logs for debug information:
- Logs start with `[Hide Offsale]`
- Helps identify where problems occur

## Tips

- The toggle button appears right next to the "Create a Pass" button
- **Blue "Hide" button** = offsale passes are currently visible
- **White "Show" button** = offsale passes are currently hidden
- Your preference is automatically saved and restored on page refresh
- The extension only modifies the display, not the actual data
