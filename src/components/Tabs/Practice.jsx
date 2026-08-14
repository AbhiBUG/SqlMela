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
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-medium"
          >
            Analyze Repositories
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
      <div className="max-w-7xl mx-auto px-6 pb-8">
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
        <button className="border-2 border-black text-[20px] px-2" >Practice</button>
      </div>



      <CodeViewerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
};

export default Practice;