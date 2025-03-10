# YouTube Transcription App

A modern Material UI application that transcribes YouTube videos directly from URLs and displays the captions in sync with video playback, similar to Spotify's lyrics feature.

## Features

- Paste any YouTube video URL to get its transcript
- Watch the YouTube video with synchronized transcript highlighting
- Automatically scrolls to the current caption as the video plays
- Click on any caption to jump to that part of the video
- Copy the full transcript to clipboard
- Clean, responsive Material UI design with Poppins font
- **No paid APIs required** - works with 100% free methods
- Multiple transcription approaches for different situations
- Shows alternative transcriptions when available

## Installation

1. Clone this repository
2. Install dependencies

```bash
npm install
```

3. Start the application (both frontend and backend)

```bash
npm run dev
```

This will start both the React frontend and the Express backend server.

## How It Works

The application uses a multi-layered approach to get the most accurate transcripts:

1. Extracts the video ID from the YouTube URL
2. First attempts to use YouTube's built-in captions (fastest method)
3. For missing captions, tries alternative free methods:
   - YouTube Data API v3 (optional, requires your own free API key)
   - Free third-party transcript APIs
   - OCR for videos with burned-in subtitles (experimental)
4. Post-processes transcript text to fix common transcription errors
5. Shows alternative transcriptions when sources disagree
6. Displays the transcript with synchronized highlighting

## Transcription Methods

- **Auto-detect**: Automatically tries all available methods in sequence
- **YouTube API**: Uses YouTube Data API to fetch captions (requires your own free API key)
- **OCR** (experimental): Attempts to extract text from videos with hardcoded subtitles

## Quality Levels

- **Standard**: Basic transcription with minimal processing
- **Enhanced**: Improved transcription with grammar and formatting corrections

## Technologies Used

- React
- Material UI
- Express.js
- YouTube IFrame API
- Natural language processing
- CSS Animations

## Limitations

- Videos must have captions available
- Works best with official captions rather than auto-generated ones
- Due to YouTube's restrictions, some videos may not expose their caption tracks

## License

MIT 