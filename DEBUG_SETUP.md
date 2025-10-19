# 🔧 Debug Setup Guide - Focus Timer Extension

This guide helps you set up the **debugged version** of the Focus Timer extension and troubleshoot common issues.

## 🐛 Bugs Fixed in This Version

### 1. **Icon Loading Errors**
- **Problem**: Extension failed to load due to missing PNG icon files
- **Fix**: Created `manifest-fixed.json` without icon references
- **Alternative**: Use the setup script to generate icons automatically

### 2. **Timer Synchronization Issues**
- **Problem**: Timer would get out of sync between popup and background
- **Fix**: Added real-time sync every 2 seconds in `popup-fixed.js`
- **Result**: Timer stays accurate even when popup is closed/reopened

### 3. **Message Passing Errors**
- **Problem**: Chrome runtime errors when extension reloads
- **Fix**: Added comprehensive error handling and retry logic
- **Result**: Extension works smoothly even during development

### 4. **Content Script Injection Problems** 
- **Problem**: Site blocking didn't work reliably on all websites
- **Fix**: Improved DOM handling and fail-safe mechanisms
- **Result**: Blocking overlay works consistently across all sites

### 5. **Data Persistence Issues**
- **Problem**: Settings would sometimes get lost
- **Fix**: Added data validation and backup mechanisms
- **Result**: Your settings are always preserved

## 🚀 Quick Setup (Use Fixed Version)

### Method 1: Use Fixed Files

1. **Download** the repository as ZIP
2. **Extract** to a folder 
3. **Copy these files** to replace the originals:
   ```
   manifest-fixed.json  →  manifest.json
   popup-fixed.html     →  popup.html  
   popup-fixed.js       →  popup.js
   background-fixed.js  →  background.js
   content-fixed.js     →  content.js
   ```
4. **Load in Chrome** developer mode

### Method 2: Use Setup Script (Automatic)

1. **Run `setup.bat`** (Windows) in the extracted folder
2. **Follow prompts** to create icon files
3. **Load the extension** when Chrome opens

## 🔍 Testing the Extension

### Basic Functionality Test

1. **Install the extension** in developer mode
2. **Click the extension icon** - popup should open without errors
3. **Start a 15-minute timer**
4. **Add `youtube.com` to blocked sites**
5. **Visit YouTube** - should show blocking screen
6. **Check the badge** - should show remaining minutes

### Debug Console Checks

1. **Open Chrome Developer Tools** (`F12`)
2. **Go to Console tab**
3. **Check for errors** - there should be none with the fixed version
4. **Expected logs**:
   ```
   Focus Timer Background initializing...
   Site Blocker content script loaded on: [website]
   Timer started with [X] seconds
   ```

## 🛠️ Troubleshooting Common Issues

### Issue: "Failed to load extension"
**Solution**: 
- Make sure you extracted the ZIP file first
- Check that `manifest.json` exists in the folder
- Use `manifest-fixed.json` if regular manifest fails

### Issue: Timer not counting down
**Solution**:
- Reload the extension in `chrome://extensions/`
- Check the browser console for JavaScript errors
- Make sure you're using `background-fixed.js`

### Issue: Sites not getting blocked
**Solution**:
- Ensure the timer is running (badge should show minutes)
- Check that sites are added correctly (no `http://` or `www.`)
- Visit a new tab of the blocked site
- Make sure you're using `content-fixed.js`

### Issue: Popup won't open
**Solution**:
- Right-click the extension icon → Inspect popup
- Check for JavaScript errors in the popup console
- Make sure you're using `popup-fixed.js` and `popup-fixed.html`

### Issue: Extension keeps reloading
**Solution**:
- This is normal during development
- Fixed version handles reloads gracefully
- Your timer progress will be preserved

## 🧪 Advanced Debugging

### Background Script Debugging

1. **Go to** `chrome://extensions/`
2. **Find Focus Timer** extension
3. **Click "Inspect views: background page"**
4. **Check console** for background script logs

### Content Script Debugging

1. **Visit a blocked site** (like YouTube)
2. **Open Developer Tools** (`F12`)
3. **Check Console** for content script messages
4. **Expected**: "Site Blocker content script loaded"

### Storage Debugging

1. **Open Developer Tools** on any webpage
2. **Go to Application → Storage → Extension Storage**
3. **Find your extension** in the list
4. **View stored data**: `focusTimer` and `blockedSites`

## 📋 File Comparison

| Original File | Fixed Version | Main Improvements |
|---------------|---------------|------------------|
| `manifest.json` | `manifest-fixed.json` | No icon references, better permissions |
| `popup.js` | `popup-fixed.js` | Real-time sync, error handling |
| `background.js` | `background-fixed.js` | Data validation, stability fixes |
| `content.js` | `content-fixed.js` | Better DOM handling, fail-safes |
| `popup.html` | `popup-fixed.html` | Uses fixed JS, better styling |

## 🎯 Performance Improvements

- **Reduced API calls** with throttled saving
- **Better memory management** with cleanup
- **Smoother UI updates** with optimized rendering
- **Faster site detection** with improved algorithms
- **Reliable notifications** with fallback mechanisms

## ✅ Success Indicators

### Extension Working Correctly:
- ✅ Popup opens without errors
- ✅ Timer counts down smoothly  
- ✅ Badge shows remaining minutes
- ✅ Blocked sites show overlay
- ✅ Settings persist between sessions
- ✅ No console errors

### Ready for Production:
- ✅ All tests pass
- ✅ No JavaScript errors
- ✅ Clean console output
- ✅ Smooth user experience
- ✅ Data persists correctly

## 🚀 Next Steps

Once debugging is complete:

1. **Test thoroughly** with different websites
2. **Try edge cases** (very short timers, many blocked sites)
3. **Verify persistence** (restart Chrome, check if settings saved)
4. **Consider additional features** based on usage

---

**Need Help?** Check the console logs first, then compare with the fixed versions. The debugged code includes comprehensive error handling and logging to help identify any remaining issues.