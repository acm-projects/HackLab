const axios = require('axios');
const dotenv = require('dotenv');

async function scrapeLinkedIn(linkedinUrl) {
  const api_key = process.env.SCRAPER_API_KEY;
  const url = 'https://api.scrapingdog.com/linkedin';

  const params = {
    api_key: api_key,
    type: 'profile',
    linkId: linkedinUrl.replace("https://www.linkedin.com/in/", ""),
    private: 'false',
  };

  try {
    const response = await axios.get(url, { params });
    if (response.status === 200) {
      console.log("linkedin data: ", response.data);
      return response.data;
    } else {
      console.log('Request failed with status code:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error making the request:', error.message);
    return null;
  }
}

module.exports = { scrapeLinkedIn };
