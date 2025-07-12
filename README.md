# X-UI Port Extractor Chrome Extension

<div align="center"><img src="https://raw.githubusercontent.com/vUnkname/X-UI-Port-Extractor/main/screenshot.png" width="500">
<br>

برای توضیحات به <a href="https://github.com/vUnkname/X-UI-Port-Extractor/blob/main/README-FA.md"> زبان فارسی، اینجا کلیک کنید</a>

</div>
<br><br>

A powerful Chrome extension that extracts port numbers from X-UI web tables with advanced filtering capabilities and modern interface design.

## 🚀 Features

### Core Functionality
- **📊 Smart Port Extraction**: Automatically extracts port numbers from X-UI Ant Design tables
- **🔍 Protocol Filtering**: Skip ports based on protocol types (NEW!)
- **📋 Flexible Copy Options**: Copy ports in comma-separated format with custom prefix/postfix
- **💾 Persistent Storage**: Saves extracted ports and settings between sessions
- **⚡ Real-time Feedback**: Clear status messages and loading animations

### Protocol Filter (NEW)
Skip ports with selected protocols:
- `dokodemo-door`
- `socks`
- `http`
- `wireguard`
- `vless`
- `trojan`
- `vmess`

### Interface Features
- **🎨 Modern Clean UI**: Professional interface inspired by password managers
- **🔄 Dual Button Access**: Main buttons and quick-access buttons in textarea
- **📱 Responsive Design**: Optimized for various screen sizes
- **🎯 Intuitive Controls**: Easy-to-use checkboxes and radio buttons
- **🌟 Hover Effects**: Interactive feedback for all elements

## 📦 Installation

### Method 1: Chrome Web Store (Recommended)
*Coming soon...*

### Method 2: Manual Installation
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The X-UI Port Extractor icon will appear in your Chrome toolbar

## 🎯 Usage

### Basic Usage
1. Navigate to your X-UI admin panel
2. Click the extension icon to open the popup
3. Click "Extract ports" to scan the page for port numbers
4. The extracted ports appear in the text area
5. Click "Copy ports" to copy them to your clipboard

### Advanced Usage with Protocol Filtering
1. Open the extension popup
2. In the **Protocol Filter** section, check the protocols you want to **exclude**
3. Click "Extract ports" - only ports with unchecked protocols will be extracted
4. The status message will show which protocols were filtered out

### Custom Text Options
1. Enable the "Custom Text" checkbox
2. Choose between:
   - **Prefix**: Add text before each port (e.g., `server-2053,server-17002`)
   - **Postfix**: Add text after each port (e.g., `2053-iran,17002-iran`)
3. Enter your custom text in the input field
4. Copy ports with your custom formatting

## 🔧 Interface Overview

### Main Sections
- **📊 Port Display Area**: Shows extracted ports with quick action buttons
- **🎛️ Protocol Filter**: Checkbox grid for protocol filtering
- **⚙️ Custom Text Options**: Prefix/postfix configuration
- **🔘 Action Buttons**: Extract and copy functionality

### Status Messages
- **🟢 Success**: Shows number of extracted ports and filtered protocols
- **🔴 Error**: Clear error messages for troubleshooting
- **🔵 Info**: Loading states and process feedback

## 🎯 Target Table Structure

The extension works with X-UI tables containing these columns:
```
ID | Menu | Enabled | Remark | Port | Protocol | Clients | Traffic | Duration
```

- **Port extraction**: From the 5th column (Port)
- **Protocol filtering**: Based on the 6th column (Protocol)
- **Port validation**: Range 1-65535
- **Order preservation**: Maintains original table order

## 🛠️ Technical Details

### Extension Specifications
- **Manifest Version**: V3 (Latest Chrome standard)
- **Permissions**: `activeTab`, `scripting`, `storage`
- **Target Elements**: `.ant-table-tbody` (X-UI admin panels)
- **Browser Compatibility**: Chrome 88+

### File Structure
```
X-UI-Port-Extractor/
├── manifest.json          # Extension manifest
├── popup.html             # Main interface
├── popup.js               # Core functionality
├── content.js             # Content script
├── styles.css             # Modern styling
├── screenshot.png         # Interface preview
├── README.md              # English documentation
├── README-FA.md           # Persian documentation
└── icons/                 # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Key Features Implementation
- **Protocol Filtering**: Dynamic checkbox system with real-time filtering
- **Modern UI**: CSS Grid layout with hover effects and transitions
- **Clipboard API**: Modern clipboard access with fallback support
- **Error Handling**: Comprehensive error catching and user feedback
- **Performance**: Optimized DOM queries and minimal resource usage

## 🎨 Design Philosophy

The interface follows modern web design principles:
- **Minimalist**: Clean white background with subtle borders
- **Consistent**: Red accent color (#dc3545) throughout
- **Professional**: Typography inspired by developer tools
- **Responsive**: Hover states and smooth transitions
- **Accessible**: Clear iconography and readable text

## 🔄 Development

### Setting Up Development Environment
1. Clone the repository
2. Make your changes to the relevant files:
   - `popup.html` - Interface modifications
   - `popup.js` - Functionality changes
   - `styles.css` - Styling updates
   - `content.js` - Content script modifications
3. Load the extension in Chrome for testing
4. Test with various X-UI panel configurations

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📊 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Primary target |
| Edge | ✅ Full | Chromium-based |
| Firefox | ❌ No | Uses Manifest V3 |
| Safari | ❌ No | Different extension system |

## 🔒 Privacy & Security

- **No Data Collection**: Extension doesn't collect or transmit user data
- **Local Storage Only**: Settings saved locally in browser
- **Minimal Permissions**: Only requests necessary permissions
- **No External Connections**: Works entirely offline

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built for the X-UI community
- Inspired by modern password manager interfaces
- Uses Ant Design table detection for X-UI compatibility

---

**Made with ❤️ for X-UI users worldwide**

*For Persian documentation, click the link at the top of this page* 