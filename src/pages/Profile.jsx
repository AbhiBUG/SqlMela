import React from "react";
import { AiOutlineUser } from "react-icons/ai";

const Profile = ({username}) => {
  return (
    <div className="min-h-screen bg-base/50 p-6">

      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* ================= Profile Card ================= */}

        <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center">

          {/* Left */}

          <div className="flex items-center gap-6">

            <div className="h-28 w-28 rounded-full bg-slate-200 flex justify-center items-center text-6xl">
              <AiOutlineUser />
            </div>

            <div>

              <h1 className="text-3xl font-bold">{username}</h1>

              <p className="text-gray-500">@nickname</p>

              <div className="flex gap-5 mt-3 text-sm">

                <span>NA League</span>

                <span>NA Streak</span>

                <span>NA Level</span>

              </div>

            </div>

          </div>

          {/* Right */}

          <div className="text-right">

            <h2 className="text-2xl font-bold text-blue-600">
              NA Rank
            </h2>

            <p className="text-gray-500">
              Rating : NA
            </p>

          </div>

        </div>

        {/* ================= Quick Stats ================= */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          <div className="bg-white rounded-xl shadow p-5 text-center">
            <h3 className="text-gray-500">Problems Solved</h3>
            <p className="text-3xl font-bold mt-2">NA</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 text-center">
            <h3 className="text-gray-500">Accuracy</h3>
            <p className="text-3xl font-bold mt-2">NA</p>
          </div>

          <div className="bg-white rounded-xl shadow p-5 text-center">
            <h3 className="text-gray-500">Games Played</h3>
            <p className="text-3xl font-bold mt-2">NA</p>
          </div>

          {/* <div className="bg-white rounded-xl shadow p-5 text-center">
            <h3 className="text-gray-500">XP</h3>
            <p className="text-3xl font-bold mt-2">NA</p>
          </div> */}

        </div>

        {/* ================= Leaderboards + Scores ================= */}

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl shadow p-5">

            <h2 className="text-xl font-semibold mb-4">
              Leaderboards
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>Global Rank</span>
                <span>NA</span>
              </div>

              {/* <div className="flex justify-between">
                <span>Country Rank</span>
                <span>#18</span>
              </div> */}

              {/* <div className="flex justify-between">
                <span>College Rank</span>
                <span>#2</span>
              </div> */}

            </div>

          </div>

          <div className="bg-white rounded-xl shadow p-5">

            <h2 className="text-xl font-semibold mb-4">
              Difficulty Breakdown
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>Easy</span>
                <span>NA</span>
              </div>

              <div className="flex justify-between">
                <span>Medium</span>
                <span>NA</span>
              </div>

              <div className="flex justify-between">
                <span>Hard</span>
                <span>NA</span>
              </div>

              <div className="flex justify-between">
                <span>Expert</span>
                <span>NA</span>
              </div>

            </div>

          </div>

        </div>

        {/* ================= Analytics ================= */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Analytics
          </h2>

          <div className="h-72 border-2 border-dashed rounded-xl flex justify-center items-center text-gray-400">

            Rating Graph / Heatmap / Charts

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;