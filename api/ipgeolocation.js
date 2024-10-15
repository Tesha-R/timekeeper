import axios from 'axios';

export default async function handler(req, res) {
  const apiKey = process.env.API_IPGEOLOCATION_URL; // Securely get API key from environment variables
  const { location } = req.query; // Extract the location from the request query

  try {
    const response = await axios.get(`https://api.ipgeolocation.io/timezone`, {
      params: {
        apiKey: apiKey, // Securely use the API key
        location: location, // Pass the location from the frontend
      },
    });

    // Send the response back to the frontend
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data from IPGeolocation API:', error);
    res.status(500).json({ message: 'Error fetching geolocation data' });
  }
}
