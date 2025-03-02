import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import TranscribeForm from './components/TranscribeForm';
import VideoPlayer from './components/VideoPlayer';
import Transcript from './components/Transcript';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h3: {
          fontWeight: 600,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transcriptionQuality, setTranscriptionQuality] = useState('standard');
  const [transcriptionMethod, setTranscriptionMethod] = useState('auto');
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [showApiKeyField, setShowApiKeyField] = useState(false);

  const handleSubmit = (url) => {
    setVideoUrl(url);
    setError(null);
    const id = extractVideoId(url);
    
    if (!id) {
      setError('Invalid YouTube URL. Please provide a valid YouTube video URL.');
      return;
    }
    
    setVideoId(id);
    fetchTranscript(id);
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const fetchTranscript = async (videoId) => {
    try {
      setLoading(true);
      setTranscript([]);
      
      // Build API URL with all parameters
      let apiUrl = `/api/transcript?videoId=${videoId}&quality=${transcriptionQuality}&method=${transcriptionMethod}`;
      
      // Add YouTube API key if provided
      if (youtubeApiKey) {
        apiUrl += `&youtubeApiKey=${encodeURIComponent(youtubeApiKey)}`;
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.userMessage || errorData.error || 'Failed to fetch transcript');
      }
      
      const data = await response.json();
      
      if (!data.transcript || data.transcript.length === 0) {
        throw new Error('No transcript data available for this video');
      }
      
      setTranscript(data.transcript);
    } catch (error) {
      console.error('Error fetching transcript:', error);
      setError(error.message || 'Failed to fetch transcript');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  const handleQualityChange = (event) => {
    setTranscriptionQuality(event.target.value);
  };

  const handleMethodChange = (event) => {
    const method = event.target.value;
    setTranscriptionMethod(method);
    setShowApiKeyField(method === 'api');
  };

  const handleApiKeyChange = (event) => {
    setYoutubeApiKey(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom className="app-title">
            YouTube Transcription
          </Typography>
          
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="quality-label">Quality</InputLabel>
              <Select
                labelId="quality-label"
                value={transcriptionQuality}
                label="Quality"
                onChange={handleQualityChange}
                size="small"
              >
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="high">Enhanced</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl>
              <RadioGroup
                row
                value={transcriptionMethod}
                onChange={handleMethodChange}
              >
                <FormControlLabel 
                  value="auto" 
                  control={<Radio size="small" />} 
                  label="Auto-detect" 
                />
                <FormControlLabel 
                  value="api" 
                  control={<Radio size="small" />} 
                  label="YouTube API (key required)" 
                />
                <FormControlLabel 
                  value="ocr" 
                  control={<Radio size="small" />} 
                  label="OCR (experimental)" 
                />
              </RadioGroup>
            </FormControl>
          </Box>
          
          {showApiKeyField && (
            <Box sx={{ mb: 3 }}>
              <TextField
                label="YouTube API Key"
                variant="outlined"
                size="small"
                fullWidth
                value={youtubeApiKey}
                onChange={handleApiKeyChange}
                placeholder="Enter your YouTube Data API v3 key"
                helperText="Get a key from Google Cloud Console"
              />
            </Box>
          )}
          
          <TranscribeForm onSubmit={handleSubmit} isLoading={loading} />
          
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}
          
          {videoId && (
            <Box className="player-container">
              <VideoPlayer 
                videoId={videoId} 
                onTimeUpdate={handleTimeUpdate} 
              />
            </Box>
          )}
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : transcript.length > 0 ? (
            <Transcript 
              transcript={transcript} 
              currentTime={currentTime} 
            />
          ) : null}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 