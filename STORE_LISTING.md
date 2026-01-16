# Chrome Web Store Listing Guide

## Extension Details

**Name:** Voice Input for Claude

**Short Description (132 chars max):**
Add voice-to-text input to Claude AI using OpenAI Whisper. Click the mic button, speak, and your words appear in the chat.

**Detailed Description:**
```
Voice Input for Claude adds a convenient microphone button to Claude's chat interface, allowing you to speak your prompts instead of typing them.

HOW IT WORKS:
1. Click the microphone icon in Claude's chat input
2. Speak your message
3. Click "Stop Recording" when done
4. Your speech is transcribed and inserted at your cursor position

FEATURES:
• Seamless integration with Claude's interface
• Records audio directly in your browser
• Uses OpenAI's Whisper API for accurate transcription
• Supports inserting text at cursor position
• Visual recording indicator with timer
• Works on both new chats and existing conversations

REQUIREMENTS:
• OpenAI API key (get one at platform.openai.com)
• Microphone access permission

PRIVACY:
• Your API key is stored locally in your browser
• Audio is sent directly to OpenAI - we never see your recordings
• No analytics, tracking, or data collection

SETUP:
1. Install the extension
2. Click the extension icon in your toolbar
3. Enter your OpenAI API key
4. Navigate to claude.ai and start talking!

Perfect for:
• Long-form prompts
• Accessibility needs
• Hands-free interaction
• Quick note-taking
```

## Category
**Primary:** Productivity
**Additional:** Accessibility

## Language
English

## Required Assets

### Screenshots (Required - at least 1)
- Size: 1280x800 or 640x400
- Must show the extension in action on claude.ai

**Screenshot suggestions:**
1. Chat input showing the microphone button
2. Recording popup with timer
3. Settings popup with API key field
4. Transcribed text appearing in chat

### Promotional Images

| Asset | Size | File |
|-------|------|------|
| Small promo tile | 440x280 | store-assets/promo-small-440x280.png |

**Note:** Take actual screenshots of the extension in use on claude.ai for the best listing.

## Privacy Practices Declaration

When submitting, you'll need to declare:

### Single Purpose Description
"This extension adds voice input capability to Claude's chat interface by recording audio and sending it to OpenAI's Whisper API for transcription."

### Permission Justifications

| Permission | Justification |
|------------|---------------|
| storage | Store user's OpenAI API key locally |
| activeTab | Inject microphone button into Claude's interface |
| host_permissions (claude.ai) | Required to modify Claude's chat interface |

### Data Usage Declaration
- **Microphone:** Used to record user's voice for transcription
- **OpenAI API Key:** Stored locally, sent only to OpenAI API
- No data is collected, stored on external servers, or shared

## Hosting Privacy Policy

The privacy policy file (`privacy-policy.html`) needs to be hosted publicly. Options:

1. **GitHub Pages** (recommended):
   - Create a GitHub repo
   - Enable GitHub Pages in settings
   - URL will be: `https://yourusername.github.io/WebClaudeDuet/privacy-policy.html`

2. **Any web hosting:**
   - Upload the HTML file to your hosting provider
   - Use the public URL in your store listing

## Submission Checklist

- [ ] ZIP file created (exclude store-assets and privacy-policy.html)
- [ ] Privacy policy hosted and URL ready
- [ ] At least 1 screenshot taken (1280x800)
- [ ] Promotional tile ready (440x280)
- [ ] Developer account registered ($5 fee paid)
- [ ] Description reviewed for accuracy
- [ ] Extension tested thoroughly

## Publishing Steps

1. Go to https://chrome.google.com/webstore/devconsole
2. Click "New Item"
3. Upload `WebClaudeDuet.zip`
4. Fill in all listing details from above
5. Upload screenshots and promotional images
6. Complete privacy practices questionnaire
7. Submit for review

Review typically takes 1-3 business days.
