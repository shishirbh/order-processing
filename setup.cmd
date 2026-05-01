@echo off
setlocal enabledelayedexpansion
title DK Order Processing Setup

:: ── Always pause at the end, even if something fails ─
set EXIT_CODE=0
goto :main

:quit
if %EXIT_CODE% neq 0 (
    echo.
    echo [ERROR] Setup encountered a problem. See above for details.
)
echo.
echo Press any key to close this window...
pause >nul
exit /b %EXIT_CODE%

:main
echo ============================================
echo   DK Hardware - Order Processing Setup
echo ============================================
echo.
echo This window will stay open so you can read any messages.
echo.

:: ── Check winget (Windows Package Manager) ─────
set WINGET=0
winget --version >nul 2>&1 && set WINGET=1

:: ── Step 1: Install Node.js if missing ─────────
node --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [*] Node.js not found - installing...
    if !WINGET!==1 (
        echo [*] Installing via winget...
        winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
        if !errorlevel! neq 0 (
            echo [ERROR] Failed to install Node.js via winget.
            echo Please install manually: https://nodejs.org
            set EXIT_CODE=1
            goto :quit
        )
        echo [OK] Node.js installed - please restart this script in a new terminal
        set EXIT_CODE=0
        goto :quit
    ) else (
        echo [ERROR] Node.js is not installed and winget is not available.
        echo Please install Node.js from https://nodejs.org (v18 or later^)
        set EXIT_CODE=1
        goto :quit
    )
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo [OK] Node.js found: !NODE_VER!

:: ── Step 2: npm (comes with Node.js) ────────────
npm --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] npm not found - Node.js install may be broken.
    echo Try reinstalling from https://nodejs.org
    set EXIT_CODE=1
    goto :quit
)
for /f "tokens=*" %%v in ('npm -v') do set NPM_VER=%%v
echo [OK] npm found: v!NPM_VER!

:: ── Step 3: Install Git if missing ──────────────
git --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [*] Git not found - installing...
    if !WINGET!==1 (
        echo [*] Installing via winget...
        winget install Git.Git --silent --accept-package-agreements --accept-source-agreements
        if !errorlevel! neq 0 (
            echo [ERROR] Failed to install Git via winget.
            echo Please install manually: https://git-scm.com
            set EXIT_CODE=1
            goto :quit
        )
        echo [OK] Git installed - please restart this script in a new terminal
        set EXIT_CODE=0
        goto :quit
    ) else (
        echo [ERROR] Git is not installed and winget is not available.
        echo Please install Git from https://git-scm.com
        set EXIT_CODE=1
        goto :quit
    )
)
echo [OK] Git found

:: ── Step 4: Install pi (if not present) ─────────
echo.
echo [*] Checking pi coding agent...

call npm list -g @mariozechner/pi-coding-agent >nul 2>&1
if !errorlevel! neq 0 (
    echo [*] Installing pi (@mariozechner/pi-coding-agent)...
    call npm install -g @mariozechner/pi-coding-agent
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to install pi.
        set EXIT_CODE=1
        goto :quit
    )
)
echo [OK] pi is ready

:: ── Step 5: Install dk-order-processing ─────────
echo.
echo [*] Installing dk-order-processing from this directory...

call npm install
if !errorlevel! neq 0 (
    echo [ERROR] Failed to install dependencies.
    set EXIT_CODE=1
    goto :quit
)

call npm link
if !errorlevel! neq 0 (
    echo [ERROR] Failed to link.
    set EXIT_CODE=1
    goto :quit
)
echo [OK] dk-order-processing installed

:: ── Step 6: Launch ──────────────────────────────
echo.
echo ============================================
echo   Setup complete - launching...
echo ============================================
echo.

call dk-order-processing

echo.
echo dk-order-processing has stopped.
goto :quit
