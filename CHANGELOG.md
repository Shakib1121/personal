# Edit Log and Customization Guide

## Customization Variables

### CSS Variables (`style.css` & `gift.css`)
At the top of the CSS files, you will find a `:root` block with variables you can change:
- `--primary-bg`, `--secondary-bg`: Background gradient colors.
- `--text-color`, `--accent-color`: Main text and accent/highlight colors.
- `--font-main`, `--font-cursive`: Custom fonts used across the site.
- `--heart-color`: Color of the interactive heart trail.

### JS Constants (`script.js` & `gift.js`)
At the very top of the JS files, you can modify these configurations:

**In `script.js`:**
- `TARGET_DATE`: The target date for the countdown (e.g., "October 1, 2026 00:00:00").
- `START_DATE`: The date when the blur effect starts (used to calculate how blurry the photo should be).
- `FAVORITE_SONG_URL`: URL/Path to the song to autoplay at midnight.
- `TYPEWRITER_MESSAGE`: The message to be typed out at midnight.

**In `gift.js`:**
- `SECRET_PASSWORD`: The password required to unlock the gift page.
- `SCRATCH_ITEMS`: An array of objects defining the labels and hidden letters for each scratch-off card.

## Edits Made
- **[Initial Setup]**: Created `index.html`, `style.css`, `script.js` for the main countdown page.
- **[Main Page Features]**: Implemented the countdown timer, the progressive photo blur effect based on the date, the interactive heart trail on mouse/touch move, and the animated envelope.
- **[Midnight Reveal]**: Added logic to trigger confetti, play audio, and start the typewriter effect when the countdown hits zero.
- **[Gift Page Setup]**: Created `gift.html`, `gift.css`, `gift.js` for the secret gift section.
- **[Password Protection]**: Implemented a simple JS-based password screen that unlocks the scratch-off section.
- **[Scratch-Off Component]**: Built a custom HTML5 canvas scratch-off system where dragging the mouse/finger erases the metallic overlay to reveal the letter underneath.
- **[Responsiveness]**: Added media queries and flexible units to ensure both pages look great on mobile devices.
- **[Custom Fonts]**: Integrated Google Fonts (Outfit and Great Vibes) for a premium aesthetic.
