@echo off
echo Setting up Focus Timer Extension...
echo.

REM Create icons directory if it doesn't exist
if not exist "icons" mkdir icons

REM Check if we're in the right directory
if not exist "manifest.json" (
    echo ERROR: manifest.json not found!
    echo Please run this script from the focus-timer-extension folder.
    pause
    exit /b 1
)

echo Creating placeholder icons...

REM Create simple colored PNG files using PowerShell
powershell -Command "Add-Type -AssemblyName System.Drawing; $bmp = New-Object System.Drawing.Bitmap(16, 16); $g = [System.Drawing.Graphics]::FromImage($bmp); $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(102, 126, 234)); $g.FillEllipse($brush, 2, 2, 12, 12); $bmp.Save('icons\icon16.png', [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()"

powershell -Command "Add-Type -AssemblyName System.Drawing; $bmp = New-Object System.Drawing.Bitmap(32, 32); $g = [System.Drawing.Graphics]::FromImage($bmp); $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(102, 126, 234)); $g.FillEllipse($brush, 4, 4, 24, 24); $bmp.Save('icons\icon32.png', [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()"

powershell -Command "Add-Type -AssemblyName System.Drawing; $bmp = New-Object System.Drawing.Bitmap(48, 48); $g = [System.Drawing.Graphics]::FromImage($bmp); $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(102, 126, 234)); $g.FillEllipse($brush, 6, 6, 36, 36); $bmp.Save('icons\icon48.png', [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()"

powershell -Command "Add-Type -AssemblyName System.Drawing; $bmp = New-Object System.Drawing.Bitmap(128, 128); $g = [System.Drawing.Graphics]::FromImage($bmp); $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(102, 126, 234)); $g.FillEllipse($brush, 16, 16, 96, 96); $bmp.Save('icons\icon128.png', [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose()"

echo.
echo Icons created successfully!
echo.
echo Extension is ready to install:
echo 1. Open Chrome and go to chrome://extensions/
echo 2. Enable 'Developer mode' (top-right toggle)
echo 3. Click 'Load unpacked'
echo 4. Select this folder: %CD%
echo.
echo Press any key to open Chrome extensions page...
pause >nul

start chrome://extensions/

echo.
echo Setup complete! Follow the instructions above to load the extension.
pause