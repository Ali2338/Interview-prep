import React from 'react'

const RoleInfoHeader = ({ role, topicToFocus, experience, questions, description, lastUpdated }) => {
  return (
    <div className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[200px] flex flex-col justify-center relative z-0">
          {/* Role Info */}
          <div className="flex items-start">
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl sm:text-2xl font-medium">{role}</h2>
                  <p className="text-sm text-gray-700 mt-1">{topicToFocus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-[11px] sm:text-xs font-semibold text-white bg-black px-3 py-1 rounded-full">
              Experience: {experience} {experience === 1 ? "year" : "years"}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-white bg-black px-3 py-1 rounded-full">
              {questions} Q&A
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-white bg-black px-3 py-1 rounded-full">
              Last Updated: {lastUpdated}
            </span>
          </div>
        </div>

        {/* Background Blobs */}
        <div className="hidden md:flex w-[25vw] lg:w-[20vw] h-[200px] absolute top-0 right-0 overflow-hidden">
          <div className="w-6 h-6 bg-lime-400 blur-[65px] animate-blob1" />
          <div className="w-6 h-6 bg-teal-400 blur-[65px] animate-blob2" />
          <div className="w-6 h-6 bg-cyan-300 blur-[45px] animate-blob3" />
          <div className="w-6 h-6 bg-fuchsia-200 blur-[45px] animate-blob1" />
        </div>
      </div>
    </div>

  );
};

export default RoleInfoHeader;
