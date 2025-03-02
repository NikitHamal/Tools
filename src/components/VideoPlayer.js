import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

function VideoPlayer({ videoId, onTimeUpdate }) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state for new video
    setLoading(true);
    setError(null);
    
    // Clear previous interval if exists
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // If the YT API is already loaded, initialize player
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      // Load YouTube API if not already loaded
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      
      // Check if the script is already on the page
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      
      if (!existingScript) {
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      // Setup the callback for when API is ready
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [videoId]);

  const initializePlayer = () => {
    try {
      // Clean up previous player instance if exists
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      
      // Create new player instance
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '390',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError,
        },
      });
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
      setError('Failed to load the YouTube player. Please try again.');
      setLoading(false);
    }
  };

  const onPlayerReady = (event) => {
    setLoading(false);
    // Start tracking time
    intervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        onTimeUpdate(playerRef.current.getCurrentTime());
      }
    }, 100);
  };

  const onPlayerStateChange = (event) => {
    // YT.PlayerState.PLAYING = 1
    if (event.data === 1) {
      // If the player is paused or stopped, make sure the time tracking is active
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          onTimeUpdate(playerRef.current.getCurrentTime());
        }, 100);
      }
    } 
    // YT.PlayerState.PAUSED = 2, YT.PlayerState.ENDED = 0
    else if (event.data === 2 || event.data === 0) {
      // If the player is paused or ended, we can optionally stop the interval to save resources
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const onPlayerError = (event) => {
    console.error('YouTube player error:', event);
    setError('An error occurred while playing the video. This video may be unavailable or restricted.');
    setLoading(false);
  };

  return (
    <Box sx={{ width: '100%', position: 'relative', pb: 2 }}>
      {loading && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.1)',
          zIndex: 1,
          borderRadius: 1
        }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Box sx={{ 
          p: 3, 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          borderRadius: 1,
          textAlign: 'center'
        }}>
          <Typography variant="body1">{error}</Typography>
        </Box>
      )}
      
      <div id="youtube-player"></div>
    </Box>
  );
}

export default VideoPlayer; 