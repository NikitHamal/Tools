// Server to handle YouTube transcript extraction
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { parseString } = require('xml2js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Function to extract transcript URL from YouTube page
async function getTranscriptUrl(videoId) {
  try {
    // Fetch the video page
    const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`);
    
    // Extract the caption tracks information
    const pageContent = response.data;
    const captionTracksMatch = pageContent.match(/"captionTracks":\[(.*?)\]/);
    
    if (!captionTracksMatch || captionTracksMatch.length < 2) {
      throw new Error('No caption tracks found');
    }
    
    const captionTracks = JSON.parse(`{"captionTracks":[${captionTracksMatch[1]}]}`);
    
    // Find English captions or the first available
    const englishTrack = captionTracks.captionTracks.find(track => 
      track.languageCode === 'en' || track.name.simpleText === 'English'
    ) || captionTracks.captionTracks[0];
    
    if (!englishTrack || !englishTrack.baseUrl) {
      throw new Error('No suitable caption track found');
    }
    
    return englishTrack.baseUrl;
  } catch (error) {
    console.error('Error extracting transcript URL:', error);
    throw error;
  }
}

// Function to fetch and parse transcript
async function fetchTranscript(transcriptUrl) {
  try {
    const response = await axios.get(transcriptUrl);
    const xmlData = response.data;
    
    // Parse XML to JSON
    let transcript = [];
    parseString(xmlData, (err, result) => {
      if (err) throw err;
      
      if (result && result.transcript && result.transcript.text) {
        transcript = result.transcript.text.map(item => ({
          text: item._, 
          start: parseFloat(item.$.start),
          duration: parseFloat(item.$.dur)
        }));
      }
    });
    
    return transcript;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
}

app.get('/api/transcript', async (req, res) => {
  try {
    const { videoId } = req.query;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }
    
    const transcriptUrl = await getTranscriptUrl(videoId);
    const transcript = await fetchTranscript(transcriptUrl);
    
    return res.json({ transcript });
  } catch (error) {
    console.error('Error processing transcript request:', error);
    return res.status(500).json({ error: 'Failed to fetch transcript', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 