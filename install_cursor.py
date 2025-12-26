#!/usr/bin/env python3
"""
Windows Cursor Installer
Installs generated cursors to Windows and registers them in the registry
"""

import os
import sys
import argparse
import shutil
import winreg
from pathlib import Path


class CursorInstaller:
    """Installs cursor themes to Windows"""

    CURSOR_MAPPINGS = {
        'Arrow': 'arrow.cur',
        'Help': 'help.cur',
        'AppStarting': 'working.cur',
        'Wait': 'busy.cur',
        'Crosshair': 'cross.cur',
        'IBeam': 'beam.cur',
        'NWPen': 'handwriting.cur',
        'No': 'no.cur',
        'SizeNS': 'size_ns.cur',
        'SizeWE': 'size_we.cur',
        'SizeNWSE': 'size_nwse.cur',
        'SizeNESW': 'size_nesw.cur',
        'SizeAll': 'move.cur',
        'UpArrow': 'alternate.cur',
        'Hand': 'link.cur',
        'Person': 'person.cur',
        'Pin': 'pin.cur',
    }

    def __init__(self, style, name):
        self.style = style
        self.name = name
        self.source_dir = f'cursors/{style}'
        self.windows_cursors = Path(os.environ.get('SystemRoot', 'C:\\Windows')) / 'Cursors'
        self.install_dir = self.windows_cursors / name

    def check_admin(self):
        """Check if running with admin privileges"""
        try:
            import ctypes
            return ctypes.windll.shell32.IsUserAnAdmin() != 0
        except:
            return False

    def install_cursors(self):
        """Copy cursor files to Windows Cursors directory"""
        print(f"Installing cursors to: {self.install_dir}")

        # Create installation directory
        try:
            self.install_dir.mkdir(parents=True, exist_ok=True)
        except PermissionError:
            print("ERROR: Permission denied. Please run as Administrator.")
            return False

        # Copy all cursor files
        source_path = Path(self.source_dir)
        if not source_path.exists():
            print(f"ERROR: Source directory not found: {self.source_dir}")
            return False

        copied = 0
        for cursor_file in source_path.glob('*.cur'):
            dest = self.install_dir / cursor_file.name
            try:
                shutil.copy2(cursor_file, dest)
                copied += 1
                print(f"  Copied: {cursor_file.name}")
            except Exception as e:
                print(f"  WARNING: Failed to copy {cursor_file.name}: {e}")

        print(f"\nSuccessfully copied {copied} cursor files.")
        return copied > 0

    def register_scheme(self):
        """Register cursor scheme in Windows registry"""
        print(f"\nRegistering cursor scheme: {self.name}")

        try:
            # Open or create the Schemes key
            schemes_key_path = r'Control Panel\Cursors\Schemes'
            schemes_key = winreg.CreateKey(winreg.HKEY_CURRENT_USER, schemes_key_path)

            # Build cursor scheme string
            cursor_paths = []
            for registry_name, filename in self.CURSOR_MAPPINGS.items():
                cursor_path = str(self.install_dir / filename)
                if os.path.exists(cursor_path):
                    cursor_paths.append(cursor_path)
                else:
                    cursor_paths.append('')  # Empty if cursor doesn't exist

            # Scheme format: comma-separated list of cursor paths
            scheme_value = ','.join(cursor_paths)

            # Set the scheme
            winreg.SetValueEx(schemes_key, self.name, 0, winreg.REG_EXPAND_SZ, scheme_value)
            winreg.CloseKey(schemes_key)

            print(f"✓ Cursor scheme registered successfully!")
            print(f"\nIMPORTANT: To apply the cursors:")
            print(f"1. Open Settings > Bluetooth & devices > Mouse")
            print(f"2. Click 'Additional mouse settings'")
            print(f"3. Go to the 'Pointers' tab")
            print(f"4. Select '{self.name}' from the Scheme dropdown")
            print(f"5. Click 'Apply' and 'OK'")

            return True

        except PermissionError:
            print("ERROR: Permission denied accessing registry.")
            print("Please run as Administrator.")
            return False
        except Exception as e:
            print(f"ERROR: Failed to register scheme: {e}")
            import traceback
            traceback.print_exc()
            return False

    def install(self):
        """Perform full installation"""
        print("=" * 60)
        print(f"Installing {self.name} Cursor Theme")
        print("=" * 60)
        print()

        # Check if Windows
        if sys.platform != 'win32':
            print("ERROR: This installer only works on Windows")
            return False

        # Check admin rights (warning only, not required for current user install)
        if not self.check_admin():
            print("WARNING: Not running as Administrator")
            print("Installation will proceed for current user only.\n")

        # Install cursor files
        if not self.install_cursors():
            return False

        # Register scheme
        if not self.register_scheme():
            print("\nWARNING: Automatic registration failed.")
            print("You can still manually select the cursors from:")
            print(f"  {self.install_dir}")
            return True  # Partial success

        return True


def main():
    parser = argparse.ArgumentParser(description='Install Windows cursor theme')
    parser.add_argument('--style', required=True,
                       help='Cursor style directory name')
    parser.add_argument('--name', required=True,
                       help='Display name for the cursor theme')

    args = parser.parse_args()

    installer = CursorInstaller(args.style, args.name)
    success = installer.install()

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
