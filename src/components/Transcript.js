import React, { useRef, useEffect } from 'react';
import { Box, Typography, Paper, Tooltip, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function Transcript({ transcript, currentTime }) {
  const containerRef = useRef(null);
  const activeLineRef = useRef(null);

  // Find the current caption based on video time
  const currentCaption = transcript.find(
    (item, index) => 
      currentTime >= item.start && 
      (index === transcript.length - 1 || currentTime < transcript[index + 1].start)
  );

  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      // Scroll to the active line with smooth animation
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentCaption]);

  const copyTranscriptToClipboard = () => {
    const fullText = transcript.map(item => item.text).join(' ');
    navigator.clipboard.writeText(fullText)
      .then(() => {
        // Could show a toast notification here
        console.log('Transcript copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy transcript:', err);
      });
  };

  if (!transcript || transcript.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        Loading transcript or no captions available...
      </Typography>
    );
  }

  return (
    <Paper 
      elevation={3}
      sx={{
        p: 2,
        maxHeight: '300px',
        overflow: 'auto',
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
      ref={containerRef}
      className="transcript-container"
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        borderBottom: '1px solid #eee',
        pb: 1 
      }}>
        <Typography variant="h6" className="transcript-title">
          Transcript
        </Typography>
        <Tooltip title="Copy full transcript">
          <IconButton 
            onClick={copyTranscriptToClipboard}
            size="small"
            aria-label="Copy transcript"
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {transcript.map((line, index) => {
        const isActive = currentCaption && currentCaption.start === line.start;
        
        return (
          <Box 
            key={index}
            ref={isActive ? activeLineRef : null}
            sx={{
              p: 1,
              my: 0.5,
              borderRadius: 1,
              backgroundColor: isActive ? 'rgba(63, 81, 181, 0.15)' : 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: isActive ? 'rgba(63, 81, 181, 0.2)' : 'rgba(0, 0, 0, 0.04)',
              },
            }}
            className={`transcript-line ${isActive ? 'active-line' : ''}`}
            onClick={() => {
              // When a line is clicked, jump to that timestamp in the video
              const player = document.getElementById('youtube-player');
              if (player && player.contentWindow) {
                // Using YouTube iframe API to seek to time
                player.contentWindow.postMessage(
                  JSON.stringify({
                    event: 'command',
                    func: 'seekTo',
                    args: [line.start, true]
                  }), 
                  '*'
                );
              }
            }}
          >
            <Typography 
              variant="body1"
              sx={{
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#3f51b5' : 'inherit',
              }}
              className={`transcript-text ${isActive ? 'active-text' : ''}`}
            >
              {line.text}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              className="transcript-time"
            >
              {formatTime(line.start)}
            </Typography>
          </Box>
        );
      })}
    </Paper>
  );
}

// Helper function to format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default Transcript; 