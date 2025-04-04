const { spawn } = require('child_process');
const path = require('path');

const LINKEDIN_EMAIL = process.env.LINKEDIN_EMAIL;
const LINKEDIN_PASSWORD = process.env.LINKEDIN_PASSWORD;

async function scrapeLinkedIn(linkedinUrl) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../python/linkedin_scraper_runner.py');

    const process = spawn('python3', [scriptPath, linkedinUrl, LINKEDIN_EMAIL, LINKEDIN_PASSWORD]);

    let data = '';
    process.stdout.on('data', chunk => {
      data += chunk.toString();
    });

    process.stderr.on('data', err => {
      console.error(`stderr: ${err}`);
    });

    process.on('close', code => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          return reject(parsed.error);
        }
        resolve(parsed);
      } catch (err) {
        reject("Failed to parse scraped LinkedIn data");
      }
    });
  });
}

module.exports = { scrapeLinkedIn };
