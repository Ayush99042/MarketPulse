import axios from 'axios';

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    const response = await axios.get(`https://www.nseindia.com/api/quote-equity?symbol=${encodeURIComponent(symbol)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Referer': 'https://www.nseindia.com/get-quotes/equity?symbol=' + encodeURIComponent(symbol),
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('NSE Proxy Error:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json({ 
        error: 'NSE API error', 
        details: error.response.data 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch from NSE' });
    }
  }
}
