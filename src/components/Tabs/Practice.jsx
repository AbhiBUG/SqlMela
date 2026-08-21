import React, { useState } from "react";
import {
  FaGithub,
  FaSearch,
  FaDatabase,
  FaEdit,
  FaTrash,
  FaLink,
  FaChartBar,
  FaLayerGroup,
  FaCalculator,
  FaCode,
} from "react-icons/fa";

import CodeViewerModal from "../CodeViewerModal";


const Practice = () => {
  const [selectedQueryType, setSelectedQueryType] = useState(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);


const [repos, setRepos] = useState([]);
const [repoContent, setRepoContent] = useState([]);
const [selectedRepo, setSelectedRepo] = useState(null);

const [loadingRepos, setLoadingRepos] = useState(false);
const [loadingContent, setLoadingContent] = useState(false);
const [error, setError] = useState("");

const API_URL = "https://sqlmela.onrender.com";


  const queryTypes = [
    {
      id: "select",
      label: "SELECT",
      icon: <FaSearch size={22} />,
      description: "Retrieve data from tables",
    },
    {
      id: "insert",
      label: "INSERT",
      icon: <FaDatabase size={22} />,
      description: "Insert new records",
    },
    {
      id: "update",
      label: "UPDATE",
      icon: <FaEdit size={22} />,
      description: "Modify existing records",
    },
    {
      id: "delete",
      label: "DELETE",
      icon: <FaTrash size={22} />,
      description: "Remove records",
    },
    {
      id: "join",
      label: "JOIN",
      icon: <FaLink size={22} />,
      description: "Combine tables",
    },
    {
      id: "groupby",
      label: "GROUP BY",
      icon: <FaChartBar size={22} />,
      description: "Aggregate data",
    },
    {
      id: "subquery",
      label: "SUBQUERY",
      icon: <FaLayerGroup size={22} />,
      description: "Nested queries",
    },
    {
      id: "aggregate",
      label: "AGGREGATE",
      icon: <FaCalculator size={22} />,
      description: "Aggregate functions",
    },
  ];




  const handleAnalyzeRepositories = async () => {
  try {
    setLoadingRepos(true);
    setError("");
    setRepos([]);
    setRepoContent([]);

    const response = await fetch(
      `${API_URL}/auth/github/repos`,
      {
        method: "GET",
        credentials: "include"
      }
    );

    const data = await response.json();

    console.log("Repositories response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch repositories");
    }

    setRepos(data.repos);

  } catch (error) {
    console.error("Error fetching repositories:", error);
    setError(error.message);
  } finally {
    setLoadingRepos(false);
  }
};



const handleGetRepoContent = async (repo) => {
  try {
    setLoadingContent(true);
    setError("");
    setRepoContent([]);
    setSelectedRepo(repo);

    console.log("Testing repository:", {
      owner: repo.owner.login,
      repo: repo.name,
      private: repo.private
    });

    const response = await fetch(
      `${API_URL}/auth/github/repos/repo-content`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        credentials: "include",

        body: JSON.stringify({
          owner: repo.owner.login,
          repo: repo.name,
          path: ""
        })
      }
    );

    const data = await response.json();

    console.log("Repository content response:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch repository content"
      );
    }

    setRepoContent(
      Array.isArray(data.content) ? data.content : [data.content]
    );

  } catch (error) {
    console.error("Error fetching repository content:", error);
    setError(error.message);
  } finally {
    setLoadingContent(false);
  }
};





  const handleGithubConnect = () => {
    window.location.href =
      "https://sqlmela.onrender.com/auth/github";
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Github Connect
            </h1>
            <p className="text-gray-500 text-sm">
              Practice SQL based on your GitHub coding habits
            </p>
          </div>

          <button
            onClick={handleGithubConnect}
            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-lg transition"
          >
            <FaGithub size={20} />
            Connect GitHub
          </button>
        </div>
      </div>

      {/* GitHub Analyzer Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">



        {/* Error */}
{error && (
  <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-lg">
    {error}
  </div>
)}

{/* Repository List */}
{repos.length > 0 && (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-4">
      Your Repositories ({repos.length})
    </h3>

    <div className="space-y-3">
      {repos.map((repo) => (
        <div
          key={repo.id}
          className="border rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <h4 className="font-semibold text-gray-800">
              {repo.name}
            </h4>

            <p className="text-sm text-gray-500">
              {repo.description || "No description"}
            </p>

            <p className="text-sm mt-2">
              {repo.private ? "🔒 Private Repository" : "🌍 Public Repository"}
            </p>
          </div>

          <button
            onClick={() => handleGetRepoContent(repo)}
            disabled={loadingContent}
            className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loadingContent && selectedRepo?.id === repo.id
              ? "Fetching..."
              : "Test Files"}
          </button>
        </div>
      ))}
    </div>
  </div>
)}

{/* Repository Content */}
{selectedRepo && (
  <div className="mt-6 border rounded-xl p-5">

    <h3 className="text-lg font-semibold">
      {selectedRepo.name}
    </h3>

    <p className="text-sm text-gray-500 mb-4">
      Repository Files
    </p>

    {loadingContent && (
      <p>Fetching repository content...</p>
    )}

    {!loadingContent && repoContent.length > 0 && (
      <div className="space-y-2">
        {repoContent.map((item) => (
          <div
            key={item.path}
            className="border rounded-lg p-3 flex justify-between"
          >
            <span>
              {item.type === "dir" ? "📁" : "📄"} {item.name}
            </span>

            <span className="text-sm text-gray-500">
              {item.type}
            </span>
          </div>
        ))}
      </div>
    )}

  </div>
)}



        <div className="bg-white rounded-xl shadow p-6 border">
          <div className="flex items-center gap-3 mb-4">
            <FaGithub size={28} />
            <div>
              <h2 className="text-lg font-semibold">
                Repository Analyzer
              </h2>
              <p className="text-gray-500 text-sm">
                Analyze your repositories and identify SQL concepts
                you use less frequently.
              </p>
            </div>
          </div>
    <div className="flex flex-row justify-between">
     <button
  onClick={handleAnalyzeRepositories}
  disabled={loadingRepos}
  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50"
>
  {loadingRepos
    ? "Fetching Repositories..."
    : "Analyze Repositories"}
</button>
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg"
            >
              <FaCode />
              View Analysis
            </button>
        </div>
        </div>
      </div>


 



      {/* Query Selection */}
      <div className="max-w-7xl mx-auto px-6 pb-8 flex flex-col gap-3">
        <div className="bg-white rounded-xl shadow border p-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            Practice by SQL Topic
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {queryTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedQueryType(type.id)}
                className={`p-4 rounded-xl border transition-all
                ${
                  selectedQueryType === type.id
                    ? "border-orange-500 bg-orange-50 shadow"
                    : "border-gray-200 bg-white hover:border-orange-300"
                }`}
              >
                <div className="flex justify-center text-gray-700 mb-3">
                  {type.icon}
                </div>

                <div className="font-semibold text-gray-800">
                  {type.label}
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  {type.description}
                </div>
              </button>
            ))}
          </div>
        </div>
        <button className="text-[20px] px-5 bg-orange-600 rounded-3xl text-white p-1 h-content" >Practice</button>
      </div>



      <CodeViewerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
};

export default Practice;