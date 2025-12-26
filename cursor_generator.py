#!/usr/bin/env python3
"""
Windows 11 Cursor Generator
Generates custom cursor files (.cur) for Windows
"""

import os
import sys
import argparse
from PIL import Image, ImageDraw
from io import BytesIO
import struct


class CursorGenerator:
    """Generates Windows cursor files"""

    CURSOR_TYPES = {
        'arrow': (0, 0),           # Normal Select
        'help': (0, 0),            # Help Select
        'working': (0, 0),         # Working in Background
        'busy': (16, 16),          # Busy
        'precision': (16, 16),     # Precision Select
        'text': (16, 16),          # Text Select
        'handwriting': (0, 0),     # Handwriting
        'unavailable': (16, 16),   # Unavailable
        'resize_vertical': (16, 16),    # Vertical Resize
        'resize_horizontal': (16, 16),  # Horizontal Resize
        'resize_diag1': (16, 16),  # Diagonal Resize 1
        'resize_diag2': (16, 16),  # Diagonal Resize 2
        'move': (16, 16),          # Move
        'alternate': (0, 0),       # Alternate Select
        'link': (0, 0),            # Link Select
        'person': (16, 16),        # Person
        'pin': (0, 0),             # Location Select
    }

    def __init__(self, style='modern_black', size=32):
        self.style = style
        self.size = size
        self.output_dir = f'cursors/{style}'
        os.makedirs(self.output_dir, exist_ok=True)

    def get_color_scheme(self):
        """Returns color scheme based on style"""
        schemes = {
            'modern_black': {
                'primary': (0, 0, 0, 255),
                'secondary': (255, 255, 255, 255),
                'shadow': (0, 0, 0, 128),
                'glow': None
            },
            'modern_white': {
                'primary': (255, 255, 255, 255),
                'secondary': (0, 0, 0, 255),
                'shadow': (0, 0, 0, 200),
                'glow': None
            },
            'neon_blue': {
                'primary': (0, 150, 255, 255),
                'secondary': (255, 255, 255, 255),
                'shadow': (0, 0, 0, 128),
                'glow': (0, 200, 255, 128)
            },
            'neon_pink': {
                'primary': (255, 0, 150, 255),
                'secondary': (255, 255, 255, 255),
                'shadow': (0, 0, 0, 128),
                'glow': (255, 100, 200, 128)
            },
            'rainbow': {
                'primary': (255, 0, 0, 255),
                'secondary': (255, 255, 255, 255),
                'shadow': (0, 0, 0, 128),
                'glow': (128, 0, 255, 128)
            },
            'minimal': {
                'primary': (0, 0, 0, 255),
                'secondary': (255, 255, 255, 255),
                'shadow': None,
                'glow': None
            },
            'large': {
                'primary': (0, 0, 0, 255),
                'secondary': (255, 255, 255, 255),
                'shadow': (0, 0, 0, 128),
                'glow': None
            },
            'custom': {
                'primary': (0, 0, 0, 255),
                'secondary': (255, 255, 255, 255),
                'shadow': (0, 0, 0, 128),
                'glow': None
            }
        }
        return schemes.get(self.style, schemes['modern_black'])

    def draw_arrow(self, draw, colors, size):
        """Draw arrow cursor"""
        primary, secondary, shadow, glow = colors.values()

        # Shadow
        if shadow:
            points = [(2, 2), (2, size-6), (size//3+2, size//2+2), (size//2+2, size-2)]
            draw.polygon(points, fill=shadow)

        # Outline
        points = [(0, 0), (0, size-8), (size//3, size//2), (size//2, size-4)]
        draw.polygon(points, fill=secondary, outline=secondary, width=2)

        # Fill
        points = [(2, 2), (2, size-10), (size//3, size//2-2), (size//2-2, size-6)]
        draw.polygon(points, fill=primary)

    def draw_hand(self, draw, colors, size):
        """Draw hand/link cursor"""
        primary, secondary, shadow, glow = colors.values()

        # Simple hand shape
        if shadow:
            draw.ellipse([size//4+2, size//4+2, size*3//4+2, size*3//4+2], fill=shadow)

        draw.ellipse([size//4, size//4, size*3//4, size*3//4], fill=secondary, outline=secondary, width=2)
        draw.ellipse([size//4+2, size//4+2, size*3//4-2, size*3//4-2], fill=primary)

        # Finger
        draw.rectangle([size//2-2, size//8, size//2+2, size//2], fill=primary, outline=secondary, width=1)

    def draw_cross(self, draw, colors, size):
        """Draw precision/cross cursor"""
        primary, secondary, shadow, glow = colors.values()

        center = size // 2
        length = size // 3

        # Shadow
        if shadow:
            draw.line([center+1, center-length+1, center+1, center+length+1], fill=shadow, width=3)
            draw.line([center-length+1, center+1, center+length+1, center+1], fill=shadow, width=3)

        # Cross
        draw.line([center, center-length, center, center+length], fill=secondary, width=3)
        draw.line([center-length, center, center+length, center], fill=secondary, width=3)
        draw.line([center, center-length, center, center+length], fill=primary, width=1)
        draw.line([center-length, center, center+length, center], fill=primary, width=1)

    def draw_text_beam(self, draw, colors, size):
        """Draw text I-beam cursor"""
        primary, secondary, shadow, glow = colors.values()

        center_x = size // 2
        top_y = size // 4
        bottom_y = size * 3 // 4

        # Shadow
        if shadow:
            draw.line([center_x+1, top_y+1, center_x+1, bottom_y+1], fill=shadow, width=3)
            draw.line([center_x-4+1, top_y+1, center_x+4+1, top_y+1], fill=shadow, width=2)
            draw.line([center_x-4+1, bottom_y+1, center_x+4+1, bottom_y+1], fill=shadow, width=2)

        # I-beam
        draw.line([center_x, top_y, center_x, bottom_y], fill=secondary, width=3)
        draw.line([center_x-4, top_y, center_x+4, top_y], fill=secondary, width=2)
        draw.line([center_x-4, bottom_y, center_x+4, bottom_y], fill=secondary, width=2)
        draw.line([center_x, top_y, center_x, bottom_y], fill=primary, width=1)

    def draw_resize_vertical(self, draw, colors, size):
        """Draw vertical resize cursor"""
        primary, secondary, shadow, glow = colors.values()

        center_x = size // 2

        # Vertical line
        draw.line([center_x, 4, center_x, size-4], fill=secondary, width=3)
        draw.line([center_x, 4, center_x, size-4], fill=primary, width=1)

        # Arrows
        # Top arrow
        draw.polygon([(center_x, 2), (center_x-4, 8), (center_x+4, 8)], fill=primary, outline=secondary)
        # Bottom arrow
        draw.polygon([(center_x, size-2), (center_x-4, size-8), (center_x+4, size-8)], fill=primary, outline=secondary)

    def draw_resize_horizontal(self, draw, colors, size):
        """Draw horizontal resize cursor"""
        primary, secondary, shadow, glow = colors.values()

        center_y = size // 2

        # Horizontal line
        draw.line([4, center_y, size-4, center_y], fill=secondary, width=3)
        draw.line([4, center_y, size-4, center_y], fill=primary, width=1)

        # Arrows
        # Left arrow
        draw.polygon([(2, center_y), (8, center_y-4), (8, center_y+4)], fill=primary, outline=secondary)
        # Right arrow
        draw.polygon([(size-2, center_y), (size-8, center_y-4), (size-8, center_y+4)], fill=primary, outline=secondary)

    def draw_unavailable(self, draw, colors, size):
        """Draw unavailable/blocked cursor"""
        primary, secondary, shadow, glow = colors.values()

        # Circle with slash
        center = size // 2
        radius = size // 3

        if shadow:
            draw.ellipse([center-radius+2, center-radius+2, center+radius+2, center+radius+2], outline=shadow, width=3)

        draw.ellipse([center-radius, center-radius, center+radius, center+radius], outline=secondary, width=3)
        draw.ellipse([center-radius, center-radius, center+radius, center+radius], outline=primary, width=1)

        # Diagonal slash
        draw.line([center-radius+4, center-radius+4, center+radius-4, center+radius-4], fill=secondary, width=3)
        draw.line([center-radius+4, center-radius+4, center+radius-4, center+radius-4], fill=primary, width=1)

    def create_cursor_image(self, cursor_type):
        """Create cursor image based on type"""
        size = self.size
        if self.style == 'large':
            size = 64

        # Create transparent image
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        colors = self.get_color_scheme()

        # Draw glow if available
        if colors['glow']:
            for offset in range(3, 0, -1):
                alpha = colors['glow'][3] // (offset + 1)
                glow_color = colors['glow'][:3] + (alpha,)
                # Draw glow effect (simplified)
                pass

        # Draw appropriate cursor
        if cursor_type in ['arrow', 'help', 'working', 'alternate']:
            self.draw_arrow(draw, colors, size)
        elif cursor_type in ['link', 'person']:
            self.draw_hand(draw, colors, size)
        elif cursor_type in ['precision', 'move']:
            self.draw_cross(draw, colors, size)
        elif cursor_type == 'text':
            self.draw_text_beam(draw, colors, size)
        elif cursor_type == 'resize_vertical':
            self.draw_resize_vertical(draw, colors, size)
        elif cursor_type == 'resize_horizontal':
            self.draw_resize_horizontal(draw, colors, size)
        elif cursor_type in ['resize_diag1', 'resize_diag2']:
            self.draw_cross(draw, colors, size)
        elif cursor_type == 'unavailable':
            self.draw_unavailable(draw, colors, size)
        else:
            self.draw_arrow(draw, colors, size)

        return img

    def image_to_cur(self, img, hotspot_x, hotspot_y):
        """Convert PIL Image to .cur file format"""
        # Resize if needed
        if img.size[0] != 32 or img.size[1] != 32:
            img = img.resize((32, 32), Image.Resampling.LANCZOS)

        # Convert to bytes
        output = BytesIO()
        img.save(output, format='PNG')
        png_data = output.getvalue()

        # Create .cur file structure
        # Header
        header = struct.pack('<HHH', 0, 2, 1)  # Reserved, Type (2=cursor), Count

        # Directory entry
        width = 32 if img.size[0] == 32 else 0
        height = 32 if img.size[1] == 32 else 0

        dir_entry = struct.pack('<BBBBHHII',
            width,          # Width
            height,         # Height
            0,              # Color count
            0,              # Reserved
            hotspot_x,      # Hotspot X
            hotspot_y,      # Hotspot Y
            len(png_data),  # Size of image data
            22              # Offset to image data (6 header + 16 directory)
        )

        return header + dir_entry + png_data

    def generate_all_cursors(self):
        """Generate all cursor types"""
        print(f"Generating {self.style} cursors...")
        print(f"Output directory: {self.output_dir}")
        print()

        cursor_map = {
            'arrow.cur': 'arrow',
            'help.cur': 'help',
            'working.ani': 'working',
            'busy.ani': 'busy',
            'cross.cur': 'precision',
            'beam.cur': 'text',
            'handwriting.cur': 'handwriting',
            'no.cur': 'unavailable',
            'size_ns.cur': 'resize_vertical',
            'size_we.cur': 'resize_horizontal',
            'size_nwse.cur': 'resize_diag1',
            'size_nesw.cur': 'resize_diag2',
            'move.cur': 'move',
            'alternate.cur': 'alternate',
            'link.cur': 'link',
            'person.cur': 'person',
            'pin.cur': 'pin',
        }

        for filename, cursor_type in cursor_map.items():
            # For .ani files, create .cur instead (animated cursors are complex)
            if filename.endswith('.ani'):
                filename = filename.replace('.ani', '.cur')

            print(f"  Creating {filename}...", end=' ')

            img = self.create_cursor_image(cursor_type)
            hotspot = self.CURSOR_TYPES[cursor_type]

            cur_data = self.image_to_cur(img, hotspot[0], hotspot[1])

            output_path = os.path.join(self.output_dir, filename)
            with open(output_path, 'wb') as f:
                f.write(cur_data)

            print("✓")

        print()
        print(f"Successfully generated {len(cursor_map)} cursors!")
        return True


def main():
    parser = argparse.ArgumentParser(description='Generate Windows 11 cursors')
    parser.add_argument('--style', default='modern_black',
                       choices=['modern_black', 'modern_white', 'neon_blue', 'neon_pink',
                               'rainbow', 'minimal', 'large', 'custom'],
                       help='Cursor style to generate')
    parser.add_argument('--size', type=int, default=32,
                       help='Cursor size (default: 32)')

    args = parser.parse_args()

    try:
        generator = CursorGenerator(style=args.style, size=args.size)
        success = generator.generate_all_cursors()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
