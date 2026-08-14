import React from "react";
import M from "../assets/maintenance.png";
const Maintenance = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <img
          src={M}
          alt="Maintenance"
          className="w-72 mx-auto mb-10"
        />

        <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
          We'll be back shortly
        </h1>

        <p className="mt-4 text-gray-600 text-lg leading-relaxed">
          SqlMela is currently undergoing maintenance and improvements.
          We're working to bring the platform back online as soon as possible.
        </p>

        <div className="mt-8 text-sm text-gray-500">
          Thank you for your patience.
        </div>
      </div>
    </div>
  );
};

export default Maintenance;