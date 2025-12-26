# Windows 11 Cursor Generator

Generate and install custom cursor themes for Windows 11 with just a few clicks!

## Features

- **Multiple Cursor Styles**: Choose from 8 different cursor themes
- **Easy Installation**: Automated installer that registers cursors in Windows
- **Customizable**: Adjust cursor sizes and colors to your preference
- **High Quality**: Generated cursors work seamlessly with Windows 11

## Available Cursor Styles

1. **Modern Black** - Sleek black cursors with subtle shadows
2. **Modern White** - Clean white cursors with dark outlines
3. **Neon Blue** - Futuristic blue glowing cursors
4. **Neon Pink** - Vibrant pink glowing cursors
5. **Rainbow** - Multi-colored animated cursors
6. **Minimal** - Ultra-minimal monochrome cursors
7. **Large** - Accessibility-friendly large cursors (64x64)
8. **Custom Size** - Specify your own cursor size

## Requirements

- Windows 10 or Windows 11
- Python 3.7 or higher ([Download Python](https://www.python.org/downloads/))
- Administrator privileges (for automatic installation)

## Quick Start

### Step 1: Install Python

If you don't have Python installed:

1. Download Python from [python.org](https://www.python.org/downloads/)
2. Run the installer
3. **IMPORTANT**: Check "Add Python to PATH" during installation
4. Click "Install Now"

### Step 2: Download This Repository

1. Click the green "Code" button above
2. Select "Download ZIP"
3. Extract the ZIP file to a folder (e.g., `C:\CursorGenerator`)

### Step 3: Generate Your Cursors

1. Open the extracted folder
2. Double-click `generate_cursor.cmd`
3. Select your preferred cursor style (1-8)
4. Wait for generation to complete

### Step 4: Install Cursors

When prompted, choose installation method:

#### Option 1: Automatic Installation (Recommended)

1. Select option `1` (Auto-install)
2. The cursors will be installed and registered automatically
3. Follow the on-screen instructions to apply them

#### Option 2: Manual Installation

1. Select option `2` (Manual install)
2. Copy the generated cursor folder from `cursors\[style-name]` to `C:\Windows\Cursors\`
3. Open **Settings** > **Bluetooth & devices** > **Mouse**
4. Click **"Additional mouse settings"**
5. Go to the **"Pointers"** tab
6. Browse and select each cursor from your installed folder
7. Click **"Save As"** to save your custom scheme
8. Click **"Apply"** and **"OK"**

## Applying Your Cursors

After installation, to use your new cursors:

1. Open **Settings** (Windows + I)
2. Go to **Bluetooth & devices** > **Mouse**
3. Click **"Additional mouse settings"**
4. In the **Mouse Properties** window, go to the **"Pointers"** tab
5. Select your cursor theme from the **"Scheme"** dropdown
6. Click **"Apply"** and then **"OK"**

Your new cursors are now active!

## Advanced Usage

### Command Line Options

You can run the generator directly with Python:

```cmd
python cursor_generator.py --style modern_black --size 32
```

**Options:**
- `--style`: Choose style (modern_black, modern_white, neon_blue, neon_pink, rainbow, minimal, large, custom)
- `--size`: Set cursor size in pixels (default: 32, range: 16-128)

### Custom Installation

Install cursors manually using the installer:

```cmd
python install_cursor.py --style modern_black --name "My Custom Cursors"
```

## File Structure

```
Repository-of-Anonymity/
├── generate_cursor.cmd        # Main launcher script
├── cursor_generator.py        # Cursor generation engine
├── install_cursor.py          # Cursor installer
├── cursors/                   # Generated cursor files
│   ├── modern_black/
│   ├── modern_white/
│   └── ...
└── README.md                  # This file
```

## Troubleshooting

### "Python is not recognized"

- Reinstall Python and make sure to check "Add Python to PATH"
- Or manually add Python to your system PATH

### "Permission Denied" during installation

- Right-click `generate_cursor.cmd` and select "Run as administrator"
- Or use manual installation method

### Cursors not appearing in Settings

- Make sure you installed them to `C:\Windows\Cursors\`
- Try logging out and back in
- Check that the .cur files were generated in the `cursors\` folder

### Cursors look blurry or pixelated

- Try generating with a larger size: `--size 48` or `--size 64`
- Make sure your display scaling is set correctly in Windows Settings

## Creating Your Own Cursor Styles

You can modify `cursor_generator.py` to create custom color schemes:

1. Find the `get_color_scheme()` method
2. Add your own color scheme dictionary with:
   - `primary`: Main cursor color (R, G, B, A)
   - `secondary`: Outline color (R, G, B, A)
   - `shadow`: Shadow color (R, G, B, A) or None
   - `glow`: Glow effect color (R, G, B, A) or None

Example:

```python
'my_custom_style': {
    'primary': (255, 100, 0, 255),      # Orange
    'secondary': (0, 0, 0, 255),        # Black outline
    'shadow': (0, 0, 0, 128),           # Semi-transparent shadow
    'glow': (255, 150, 50, 128)         # Orange glow
}
```

Then add your style to the choices in `generate_cursor.cmd` and `cursor_generator.py`.

## Technical Details

### Cursor File Format

This generator creates `.cur` files (Windows cursor format) which contain:
- PNG-encoded image data
- Hotspot coordinates (click point)
- Size information

### Supported Cursor Types

The generator creates all standard Windows cursor types:
- Arrow (Normal Select)
- Help Select
- Working in Background
- Busy
- Precision Select
- Text Select
- Handwriting
- Unavailable
- Vertical Resize
- Horizontal Resize
- Diagonal Resize (both directions)
- Move
- Alternate Select
- Link Select
- Person
- Location/Pin Select

## License

This project is released under the MIT License. See [LICENSE](LICENSE) file for details.

## Contributing

Feel free to:
- Report bugs
- Suggest new cursor styles
- Submit pull requests with improvements
- Share your custom cursor designs

## Credits

Created with Python and PIL (Pillow) for image generation.

## FAQ

**Q: Can I use these cursors on Windows 10?**
A: Yes! These cursors work on both Windows 10 and Windows 11.

**Q: Will this work on macOS or Linux?**
A: No, this generates Windows-specific .cur files. macOS and Linux use different cursor formats.

**Q: Can I share the generated cursors?**
A: Yes! The generated .cur files can be shared and used on any Windows system.

**Q: How do I uninstall a cursor theme?**
A: Simply change back to the default Windows cursor scheme in Mouse Properties.

**Q: Can I create animated cursors?**
A: The current version creates static cursors. Animated cursors (.ani files) require a more complex format.

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Make sure you have Python 3.7+ installed
3. Run as Administrator if you get permission errors
4. Open an issue on GitHub with your error message

---

**Enjoy your custom Windows 11 cursors!**
