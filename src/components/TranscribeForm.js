import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import YouTubeIcon from '@mui/icons-material/YouTube';

function TranscribeForm({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }} className="url-form">
      <TextField
        fullWidth
        label="YouTube URL"
        variant="outlined"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        disabled={isLoading}
        InputProps={{
          startAdornment: <YouTubeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ mb: 2 }}
        className="url-input"
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        size="large"
        disabled={!url.trim() || isLoading}
        className="submit-button"
        sx={{ px: 3, py: 1 }}
      >
        {isLoading ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
            Processing...
          </>
        ) : (
          'Transcribe Video'
        )}
      </Button>
    </Box>
  );
}

export default TranscribeForm; 