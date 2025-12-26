@echo off
setlocal enabledelayedexpansion

:: Windows 11 Cursor Generator
:: This script generates custom cursor themes for Windows 11

title Windows 11 Cursor Generator

echo ================================================
echo    Windows 11 Cursor Generator
echo ================================================
echo.

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7 or higher from python.org
    pause
    exit /b 1
)

:: Install required Python packages
echo Checking Python dependencies...
python -m pip install --quiet --upgrade pip
python -m pip install --quiet pillow

echo.
echo Available Cursor Styles:
echo ================================================
echo 1. Modern Black - Sleek black cursors with subtle shadows
echo 2. Modern White - Clean white cursors with dark outlines
echo 3. Neon Blue - Futuristic blue glowing cursors
echo 4. Neon Pink - Vibrant pink glowing cursors
echo 5. Rainbow - Multi-colored animated cursors
echo 6. Minimal - Ultra-minimal monochrome cursors
echo 7. Large - Accessibility-friendly large cursors
echo 8. Custom Size - Specify your own size
echo ================================================
echo.

set /p choice="Select cursor style (1-8): "

set cursor_style=modern_black
set cursor_name=Modern Black

if "%choice%"=="1" (
    set cursor_style=modern_black
    set cursor_name=Modern Black
) else if "%choice%"=="2" (
    set cursor_style=modern_white
    set cursor_name=Modern White
) else if "%choice%"=="3" (
    set cursor_style=neon_blue
    set cursor_name=Neon Blue
) else if "%choice%"=="4" (
    set cursor_style=neon_pink
    set cursor_name=Neon Pink
) else if "%choice%"=="5" (
    set cursor_style=rainbow
    set cursor_name=Rainbow
) else if "%choice%"=="6" (
    set cursor_style=minimal
    set cursor_name=Minimal
) else if "%choice%"=="7" (
    set cursor_style=large
    set cursor_name=Large
) else if "%choice%"=="8" (
    set /p custom_size="Enter cursor size (32-128, default 32): "
    set cursor_style=custom
    set cursor_name=Custom Size
) else (
    echo Invalid choice. Using default: Modern Black
    set cursor_style=modern_black
    set cursor_name=Modern Black
)

echo.
echo Generating "%cursor_name%" cursors...
echo.

:: Run the Python generator
if "%cursor_style%"=="custom" (
    python cursor_generator.py --style %cursor_style% --size %custom_size%
) else (
    python cursor_generator.py --style %cursor_style%
)

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Cursor generation failed
    pause
    exit /b 1
)

echo.
echo ================================================
echo Cursor generation complete!
echo ================================================
echo.
echo Your cursors have been generated in: cursors\%cursor_style%
echo.
echo Installation Options:
echo ================================================
echo 1. Auto-install (Install and register cursors automatically)
echo 2. Manual install (You will install manually)
echo ================================================
echo.

set /p install_choice="Select installation option (1-2): "

if "%install_choice%"=="1" (
    echo.
    echo Installing cursors...
    python install_cursor.py --style %cursor_style% --name "%cursor_name%"

    if !errorlevel! equ 0 (
        echo.
        echo ================================================
        echo Installation Complete!
        echo ================================================
        echo.
        echo To apply your new cursors:
        echo 1. Open Settings ^> Bluetooth ^& devices ^> Mouse
        echo 2. Click "Additional mouse settings"
        echo 3. Go to the "Pointers" tab
        echo 4. Select "%cursor_name%" from the Scheme dropdown
        echo 5. Click "Apply" and "OK"
        echo.
    ) else (
        echo.
        echo Auto-installation failed. Please use manual installation.
        goto :manual_install
    )
) else (
    :manual_install
    echo.
    echo ================================================
    echo Manual Installation Instructions:
    echo ================================================
    echo.
    echo 1. Copy the folder: cursors\%cursor_style%
    echo    To: C:\Windows\Cursors\%cursor_name%
    echo.
    echo 2. Open Settings ^> Bluetooth ^& devices ^> Mouse
    echo 3. Click "Additional mouse settings"
    echo 4. Go to the "Pointers" tab
    echo 5. Click "Browse" for each cursor type and select from:
    echo    C:\Windows\Cursors\%cursor_name%\
    echo 6. Click "Save As" to save your scheme
    echo 7. Click "Apply" and "OK"
    echo.
)

pause
