const dotenv = require('dotenv');
const { Octokit } = require('octokit');
const fs = require('fs/promises');

dotenv.config();

//https://api.github.com/user/<username>/repos?access_token=<generated token>

async function createRepo(accessToken, title, desc) {

    const octokit = new Octokit({ 
        auth: accessToken,
    });
    const response = await octokit.request('POST /user/repos', {
    name: title,
    description: desc,
    homepage: 'https://github.com',
    'private': false
  })

  return response.data.html_url;

}
module.exports = {
    createRepo
};