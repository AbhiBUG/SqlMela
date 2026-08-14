import React, { useState, useEffect } from 'react';

const GitHubRepoSelector = ({ onRepoSelect, githubToken }) => {
  const [selectedOption, setSelectedOption] = useState('self'); // 'self' or 'remote'
  const [userRepos, setUserRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [remoteRepoUrl, setRemoteRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [showInput, setShowInput] = useState(false);

  // Fetch user's GitHub repos
  useEffect(() => {
    if (githubToken) {
      fetchUserRepos();
    } else {
      setShowInput(true);
    }
  }, [githubToken]);

  const fetchUserRepos = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch user profile
      const profileResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch GitHub profile');
      }

      const profile = await profileResponse.json();
      setUserProfile(profile);

      // Fetch user repos
      const reposResponse = await fetch('https://api.github.com/user/repos?type=owner&per_page=100', {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!reposResponse.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const repos = await reposResponse.json();
      if (repos.length === 0) {
        setShowInput(true);
        setError('No repositories found in your GitHub account. Please enter a remote repository.');
      } else {
        setUserRepos(repos);
        setSelectedRepo(repos[0].full_name);
      }
    } catch (err) {
      setError(err.message);
      setShowInput(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelfRepoSelect = () => {
    setSelectedOption('self');
    setError('');
    if (selectedRepo) {
      onRepoSelect({
        type: 'self',
        repo: selectedRepo,
        url: userRepos.find(r => r.full_name === selectedRepo)?.html_url,
      });
    }
  };

  const handleRemoteRepoSelect = () => {
    setSelectedOption('remote');
    setError('');
  };

  const handleRemoteRepoSubmit = () => {
    if (!remoteRepoUrl.trim()) {
      setError('Please enter a repository URL');
      return;
    }

    const repoPattern = /^(https?:\/\/)?(github\.com\/)?[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;
    const urlPattern = /^https?:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;

    if (!urlPattern.test(remoteRepoUrl) && !repoPattern.test(remoteRepoUrl)) {
      setError('Invalid repository URL. Format: username/repo or https://github.com/username/repo');
      return;
    }

    onRepoSelect({
      type: 'remote',
      repo: remoteRepoUrl,
      url: remoteRepoUrl.startsWith('http') ? remoteRepoUrl : `https://github.com/${remoteRepoUrl}`,
    });

    setError('');
  };

  const handleAddGitHubToken = () => {
    const token = prompt('Enter your GitHub Personal Access Token:');
    if (token) {
      localStorage.setItem('githubToken', token);
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select GitHub Repository</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {userProfile && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-gray-600">
            Logged in as: <strong>{userProfile.login}</strong>
          </p>
        </div>
      )}

      {/* Option Selection */}
      <div className="mb-6 space-y-3">
        {/* Self Repository Option */}
        <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition"
          style={{
            borderColor: selectedOption === 'self' ? '#3b82f6' : '#e5e7eb',
            backgroundColor: selectedOption === 'self' ? '#eff6ff' : '#f9fafb',
          }}>
          <input
            type="radio"
            name="repo-option"
            value="self"
            checked={selectedOption === 'self'}
            onChange={() => setSelectedOption('self')}
            className="mt-1 mr-3"
          />
          <div className="flex-1">
            <span className="font-semibold text-gray-800">My Repository</span>
            <p className="text-sm text-gray-600 mt-1">
              {loading ? 'Loading your repositories...' : 'Select from your GitHub repositories'}
            </p>
          </div>
        </label>

        {/* Remote Repository Option */}
        <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition"
          style={{
            borderColor: selectedOption === 'remote' ? '#3b82f6' : '#e5e7eb',
            backgroundColor: selectedOption === 'remote' ? '#eff6ff' : '#f9fafb',
          }}>
          <input
            type="radio"
            name="repo-option"
            value="remote"
            checked={selectedOption === 'remote'}
            onChange={() => setSelectedOption('remote')}
            className="mt-1 mr-3"
          />
          <div className="flex-1">
            <span className="font-semibold text-gray-800">Remote Repository</span>
            <p className="text-sm text-gray-600 mt-1">
              Enter any public GitHub repository URL
            </p>
          </div>
        </label>
      </div>

      {/* Self Repository Selection */}
      {selectedOption === 'self' && (
        <div className="mb-6 space-y-3">
          {!userProfile && !githubToken && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-gray-700 mb-3">
                To access your repositories, you need to authenticate with GitHub.
              </p>
              <button
                onClick={handleAddGitHubToken}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded transition"
              >
                Add GitHub Token
              </button>
            </div>
          )}

          {userRepos.length > 0 && (
            <>
              <select
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {userRepos.map((repo) => (
                  <option key={repo.id} value={repo.full_name}>
                    {repo.full_name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSelfRepoSelect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Select Repository
              </button>
            </>
          )}

          {showInput && userRepos.length === 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded">
              <p className="text-sm text-gray-700 mb-3">
                No repositories found. Please enter a repository manually below.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Remote Repository Input */}
      {selectedOption === 'remote' && (
        <div className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="e.g., username/repo or https://github.com/username/repo"
            value={remoteRepoUrl}
            onChange={(e) => setRemoteRepoUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleRemoteRepoSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Add Remote Repository
          </button>
        </div>
      )}
    </div>
  );
};

export default GitHubRepoSelector;
