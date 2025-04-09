const { spawn } = require('child_process');
const path = require('path');

const LINKEDIN_EMAIL = process.env.LINKEDIN_EMAIL;
const LINKEDIN_PASSWORD = process.env.LINKEDIN_PASSWORD;

async function scrapeLinkedIn(linkedinUrl) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`http://localhost:5000/scrape?linkedin=${encodeURIComponent(linkedinUrl)}`);
      const data = await response.json();
      if (data.error) return reject(data.error);
      resolve(data);
    } catch (err) {
      reject("Failed to get LinkedIn data from local scraper: " + err.message);
    }
  });
}

module.exports = { scrapeLinkedIn };
