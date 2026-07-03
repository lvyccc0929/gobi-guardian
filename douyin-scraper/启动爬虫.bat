@echo off
title Douyin Scraper
echo.
echo  ========================================
echo    Douyin Positive Comment Scraper
echo  ========================================
echo.
set /p keyword=Enter search keyword: 
echo.
echo  Searching: %keyword%
echo  Please wait, browser will auto-operate...
echo.
python main.py -k "%keyword%"
echo.
echo  Done! Press any key to close...
pause >nul