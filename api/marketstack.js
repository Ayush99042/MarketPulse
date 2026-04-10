import axios from 'axios';

export default async function handler(req, res) {
  const { path = 'v1/eod', ...params } = req.query;

  try {
    const response = await axios.get(`https://api.marketstack.com/${path}`, {
      params: params,
      timeout: 10000,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Marketstack Proxy Error:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json({ 
        error: 'Marketstack API error', 
        details: error.response.data 
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch from Marketstack' });
    }
  }
}
