import React from "react";

interface LoadingStateProps {
  stage: "processing" | "generating" | "rendering";
}

const LoadingState: React.FC<LoadingStateProps> = ({ stage }) => {
  const stages = [
    { id: "processing", label: "Processing prompt" },
    { id: "generating", label: "Generating Manim code" },
    { id: "rendering", label: "Rendering animation" },
  ];

  const currentIndex = stages.findIndex((s) => s.id === stage);

  return (
    <div className="w-full max-w-lg mx-auto py-16">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 animate-spin rounded-full border-[3px] border-blue-500/20 border-t-blue-500 shadow-lg"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="h-16 w-16 animate-spin rounded-full border-[2px] border-blue-400/30 border-t-blue-400"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-pulse bg-blue-500/20 rounded-full"></div>
          </div>
        </div>

        <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Working on it
            </h3>
            <p className="text-white/70 text-sm">This might take a moment</p>
          </div>

          <div className="space-y-4">
            {stages.map((s, index) => (
              <div key={s.id} className="flex items-center group">
                <div className="relative mr-4">
                  <div
                    className={`h-4 w-4 rounded-full transition-all duration-700 ease-out ${
                      index < currentIndex
                        ? "bg-green-500 shadow-lg shadow-green-500/40 scale-110"
                        : index === currentIndex
                        ? "bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse scale-110"
                        : "bg-white/20 scale-100"
                    }`}
                  ></div>
                  {index < currentIndex && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <span
                  className={`transition-all duration-500 ease-out ${
                    index < currentIndex
                      ? "font-semibold text-green-400"
                      : index === currentIndex
                      ? "font-semibold text-white"
                      : "font-medium text-white/40"
                  }`}
                >
                  {s.label}
                </span>

                {index === currentIndex && (
                  <div className="ml-auto">
                    <div className="flex space-x-1">
                      <div
                        className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full transition-all duration-700 ease-out shadow-sm shadow-blue-500/30"
                style={{
                  width: `${((currentIndex + 1) / stages.length) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-white/50 mt-2 text-center">
              Step {currentIndex + 1} of {stages.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
