import React, { useState } from "react";

const BugReporting = ({ changeStatus }) => {
  const [formData, setFormData] = useState({
    issueType: "Something is broken",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --------------------------------
  // Handle form changes
  // --------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------
  // Submit bug report
  // --------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate description
    if (!formData.description.trim()) {
      alert("Please describe what happened.");
      return;
    }

    setIsSubmitting(true);

    try {
      // --------------------------------
      // Automatically collect metadata
      // --------------------------------

      const metadata = {
        pageUrl: window.location.href,

        browser: navigator.userAgent,

        screenResolution: `${window.screen.width}x${window.screen.height}`,
      };

      // --------------------------------
      // Send request to backend
      // --------------------------------

      const response = await fetch(
        "https://sqlmela.onrender.com/report/bug-report",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            issueType: formData.issueType,
            description: formData.description,
            metadata,
          }),
        }
      );

      const result = await response.json();

      // --------------------------------
      // Handle backend error
      // --------------------------------

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to submit bug report"
        );
      }

      // --------------------------------
      // Success
      // --------------------------------

      alert(
        `Bug report submitted successfully!\n\nTicket ID: ${result.ticketId}`
      );

      // Reset form
      setFormData({
        issueType: "Something is broken",
        description: "",
      });

      // Close modal
      changeStatus(false);

    } catch (error) {
      console.error(
        "Bug report error:",
        error
      );

      alert(
        error.message ||
          "Failed to submit report. Please try again."
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

        {/* --------------------------------
            Header
        -------------------------------- */}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            🐞 Report an Issue
          </h2>

          <p className="text-gray-500 mt-1">
            Found something wrong? Tell us what happened.
          </p>
        </div>

        {/* --------------------------------
            Form
        -------------------------------- */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Issue Type */}

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              What type of issue is this?
            </label>

            <select
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:outline-none focus:ring-2
                         focus:ring-orange-500
                         disabled:bg-gray-100"
            >
              <option value="Something is broken">
                Something is broken
              </option>

              <option value="Query result looks wrong">
                Query result looks wrong
              </option>

              <option value="Login issue">
                Login issue
              </option>

              <option value="Page is slow">
                Page is slow
              </option>

              <option value="UI problem">
                UI problem
              </option>

              <option value="Feature request">
                Feature request
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* Description */}

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              What happened?
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
              disabled={isSubmitting}
              placeholder="Tell us what went wrong..."
              className="w-full border border-gray-300 rounded-lg p-3
                         resize-none
                         focus:outline-none focus:ring-2
                         focus:ring-orange-500
                         disabled:bg-gray-100"
            />

            <p className="text-xs text-gray-400 mt-1">
              Please include what you expected to happen
              and what actually happened.
            </p>
          </div>

          {/* Automatically captured information */}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">

            <p className="text-sm font-medium text-gray-700 mb-2">
              We'll automatically include:
            </p>

            <div className="text-sm text-gray-500 space-y-1">
              <p>✓ Current page</p>
              <p>✓ Browser information</p>
              <p>✓ Screen resolution</p>
            </div>

          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={() => changeStatus(false)}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300
                         rounded-lg text-gray-700
                         hover:bg-gray-100
                         disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-orange-600
                         text-white rounded-lg
                         hover:bg-orange-700
                         disabled:opacity-50
                         disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Sending..."
                : "Send Report"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default BugReporting;