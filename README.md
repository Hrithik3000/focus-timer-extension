# 🎯 Focus Timer - Chrome Extension

A productivity-focused Chrome extension that combines a Pomodoro timer with website blocking capabilities to help you stay focused and get things done.

## ✨ Features

- **⏰ Pomodoro Timer**: Customizable timer with preset options (15min, 25min, 45min, 1hr)
- **🚫 Website Blocking**: Block distracting websites during focus sessions
- **📱 Beautiful UI**: Modern gradient interface with smooth animations
- **🔔 Smart Notifications**: Get notified when your focus session is complete
- **📊 Visual Feedback**: Badge counter showing remaining minutes
- **💾 Persistent Data**: Your settings and progress are saved automatically
- **⚡ Real-time Sync**: Timer continues running even when popup is closed

## 🚀 Installation

### Method 1: Chrome Web Store (Coming Soon)
*This extension will be available on the Chrome Web Store soon.*

### Method 2: Developer Mode (Manual Installation)

1. **Download the Extension**
   ```bash
   git clone https://github.com/Hrithik3000/focus-timer-extension.git
   cd focus-timer-extension
   ```

2. **Enable Developer Mode**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the `focus-timer-extension` folder
   - The extension should now appear in your extensions list

4. **Pin the Extension**
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Focus Timer" and click the pin icon

## 🎮 How to Use

### Starting a Focus Session

1. **Click the Focus Timer icon** in your Chrome toolbar
2. **Choose your time**: Use preset buttons (25min, 15min, 45min, 1hr) or keep the default
3. **Add blocked sites** (optional):
   - Enter website URLs in the "Block Sites" section
   - Examples: `youtube.com`, `facebook.com`, `twitter.com`
4. **Click "Start"** to begin your focus session

### During a Focus Session

- The timer badge shows remaining minutes
- Blocked websites will show a motivational blocking screen
- You can pause or reset the timer anytime
- Focus on your work! 💪

### When the Timer Completes

- You'll receive a congratulatory notification
- The timer resets automatically
- Blocked sites become accessible again
- Time for a well-deserved break! 🎉

## 🛠️ Technical Details

### Architecture

- **Manifest V3**: Uses the latest Chrome extension architecture
- **Service Worker**: Background timer runs independently
- **Content Scripts**: Handles website blocking overlay
- **Chrome Storage**: Persists settings and timer state
- **Chrome Notifications**: Completion alerts

### File Structure

```
focus-timer-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main interface
├── popup.js              # Popup functionality
├── background.js         # Service worker
├── content.js            # Site blocking script
├── icons/                # Extension icons
└── README.md             # Documentation
```

### Key Technologies

- **JavaScript ES6+**: Modern JavaScript with classes
- **Chrome Extension APIs**: Storage, tabs, notifications
- **CSS3**: Gradient backgrounds and animations
- **HTML5**: Semantic markup

## 🔧 Development

### Prerequisites

- Google Chrome (latest version)
- Basic knowledge of JavaScript and Chrome extensions

### Setup for Development

1. Clone the repository
2. Make your changes
3. Reload the extension in `chrome://extensions/`
4. Test your changes

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📋 Permissions Explained

- **`storage`**: Save timer settings and blocked sites
- **`activeTab`**: Check current tab for blocking
- **`tabs`**: Monitor tab changes for site blocking
- **`notifications`**: Show completion alerts
- **`<all_urls>`**: Access all websites for blocking functionality

## 🐛 Troubleshooting

### Timer Not Working
- Check if the extension is enabled
- Try reloading the extension
- Restart Chrome if needed

### Sites Not Being Blocked
- Ensure the timer is running
- Check if the site is in your blocked list
- Verify the site URL format (no `http://` or `www.`)

### Extension Not Loading
- Check Chrome's developer console for errors
- Ensure all files are present
- Verify manifest.json syntax

## 🔮 Future Features

- [ ] Focus session statistics
- [ ] Different timer modes (work/break intervals)
- [ ] Productivity insights and analytics
- [ ] Sync settings across devices
- [ ] Custom blocking messages
- [ ] Sound notifications
- [ ] Dark theme support

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have suggestions, please:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Provide detailed information about the problem

## ⭐ Show Your Support

If this extension helps you stay focused and productive, please consider:
- ⭐ Starring this repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🔄 Sharing with friends

---

**Made with ❤️ for productivity enthusiasts and students everywhere!**

*"The key is not to prioritize what's on your schedule, but to schedule your priorities." - Stephen Covey*