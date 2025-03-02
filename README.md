# YouTube Transcription App

A modern Material UI application that transcribes YouTube videos directly from URLs and displays the captions in sync with video playback, similar to Spotify's lyrics feature.

## Features

- Paste any YouTube video URL to get its transcript
- Watch the YouTube video with synchronized transcript highlighting
- Automatically scrolls to the current caption as the video plays
- Click on any caption to jump to that part of the video
- Copy the full transcript to clipboard
- Clean, responsive Material UI design with Poppins font
- Works completely in the browser with server-side transcript extraction

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

The application:

1. Extracts the video ID from the YouTube URL
2. The backend fetches the YouTube page and extracts the captions track URL
3. The backend then fetches the captions in XML format and parses them
4. The frontend displays the video using YouTube iframe API
5. The transcript is displayed with the current caption highlighted
6. As the video plays, the transcript scrolls to keep the current caption visible

## Technologies Used

- React
- Material UI
- Express.js
- YouTube IFrame API
- CSS Animations

## Limitations

- Videos must have captions available
- Works best with official captions rather than auto-generated ones
- Due to YouTube's restrictions, some videos may not expose their caption tracks

## License

MIT 