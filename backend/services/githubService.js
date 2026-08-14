import fetch from 'node-fetch';

/**
 * GitHub Service - Handles GitHub API interactions
 */

export const getGitHubUserProfile = async (accessToken) => {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SqlMela-App'
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (err) {
    console.error("❌ Error fetching GitHub profile:", err.message);
    throw err;
  }
};

export const getGitHubUserRepos = async (accessToken, username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?type=owner&per_page=100`, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SqlMela-App'
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (err) {
    console.error("❌ Error fetching GitHub repos:", err.message);
    throw err;
  }
};

export const getGitHubRepoContent = async (accessToken, owner, repo, path = '') => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SqlMela-App'
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (err) {
    console.error("❌ Error fetching GitHub repo content:", err.message);
    throw err;
  }
};

export const getGitHubRawFileContent = async (accessToken, owner, repo, path) => {
  try {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'SqlMela-App'
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.text();
  } catch (err) {
    console.error("❌ Error fetching raw GitHub file:", err.message);
    throw err;
  }
};
