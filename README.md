# Voice Input for Claude

A Chrome extension that adds voice-to-text input to Claude's web interface using OpenAI's Whisper API.

![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## Features

- **Microphone button** seamlessly integrated into Claude's chat input
- **Real-time recording** with visual timer and stop button
- **OpenAI Whisper** for accurate speech-to-text transcription
- **Cursor-aware insertion** - text appears exactly where your cursor is
- **Dark mode support** - matches your system preferences

## How It Works

1. Click the microphone icon in Claude's chat input footer
2. Speak your message
3. Click "Stop Recording" when done
4. Your speech is transcribed and inserted at cursor position

## Installation

### From Chrome Web Store
*(Coming soon)*

### Manual Installation (Developer Mode)

1. Download the latest release ZIP from [Releases](https://github.com/HeilOliver/WebClaudeDuet/releases)
2. Extract the ZIP file
3. Open Chrome and navigate to `chrome://extensions`
4. Enable **Developer mode** (toggle in top-right)
5. Click **Load unpacked**
6. Select the extracted folder

## Setup

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Click the extension icon in your Chrome toolbar
3. Enter your API key and click Save
4. Navigate to [claude.ai](https://claude.ai) and start using voice input!

## Requirements

- Google Chrome browser
- OpenAI API key (for Whisper transcription)
- Microphone access

## Privacy

- Your API key is stored locally in Chrome's secure storage
- Audio is sent directly to OpenAI - we never see or store your recordings
- No analytics, tracking, or data collection
- See [privacy-policy.html](privacy-policy.html) for full details

## Development

```bash
# Clone the repository
git clone https://github.com/HeilOliver/WebClaudeDuet.git

# Load in Chrome
# 1. Go to chrome://extensions
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the WebClaudeDuet folder
```

### Project Structure

```
WebClaudeDuet/
├── manifest.json      # Extension configuration
├── content.js         # Injects UI into Claude
├── content.css        # Styles for injected elements
├── background.js      # Service worker for API calls
├── popup.html/js/css  # Settings popup
├── icons/             # Extension icons
└── privacy-policy.html
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [OpenAI Whisper](https://openai.com/research/whisper) for speech recognition
- [Anthropic Claude](https://claude.ai) for the amazing AI assistant
