import React, { useState } from 'react';


const CodeViewerModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('practice');

  const practiceCode = `import React, { useState, useEffect } from 'react';
import GitHubRepoSelector from '../GitHubRepoSelector';

const Practice = () => {
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [githubToken, setGithubToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('githubToken');
    if (token) {
      setGithubToken(token);
    }
  }, []);

  const handleRepoSelect = (repoData) => {
    setSelectedRepo(repoData);
    console.log('Selected Repository:', repoData);
  };

  const handleClearSelection = () => {
    setSelectedRepo(null);
    localStorage.removeItem('githubToken');
    setGithubToken(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* UI implementation here */}
    </div>
  );
};

export default Practice;`;

  const selectorCode = `import React, { useState, useEffect } from 'react';

const GitHubRepoSelector = ({ onRepoSelect, githubToken }) => {
  const [selectedOption, setSelectedOption] = useState('self');
  const [userRepos, setUserRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [remoteRepoUrl, setRemoteRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (githubToken) {
      fetchUserRepos();
    } else {
      setShowInput(true);
    }
  }, [githubToken]);

  const fetchUserRepos = async () => {
    setLoading(true);
    try {
      const profileResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: \`token \${githubToken}\`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      const profile = await profileResponse.json();
      setUserProfile(profile);

      const reposResponse = await fetch(
        'https://api.github.com/user/repos?type=owner&per_page=100',
        {
          headers: {
            Authorization: \`token \${githubToken}\`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      const repos = await reposResponse.json();
      setUserRepos(repos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler functions...
};

export default GitHubRepoSelector;`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Code Files</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            X
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'practice'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Practice.jsx
          </button>
          <button
            onClick={() => setActiveTab('selector')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'selector'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            GitHubRepoSelector.jsx
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto bg-gray-900 p-6">
          <pre className="text-gray-100 font-mono text-sm leading-relaxed">
            <code>
              {activeTab === 'practice' ? practiceCode : selectorCode}
            </code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeViewerModal;
