

import React, { useState, memo, Suspense, lazy } from "react";
import { Briefcase, CheckCircle, Search, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import GridPattern from "./ui/grid-pattern";

// Lazy load the IconCloudDemo component for desktop only
const MemoizedIconCloud = lazy(() => import("./IconCloudDemo"));

// Memoize static Hero text content
const MemoizedHeroText = memo(() => {
  return (
    <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
      <div className="flex items-center justify-center lg:justify-start mb-4 lg:mb-6">
        <span className="inline-flex items-center px-3 py-1 lg:px-4 lg:py-2 rounded-full bg-blue-50 text-blue-800 text-sm lg:text-base font-semibold shadow-sm transform transition hover:scale-105 hover:shadow-md">
          <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-600" />
          No. 1 Job Hunt Website
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-4 lg:mb-6">
        Search, Apply & Get Your <span className="text-blue-700">Dream Job</span>
      </h1>

      <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mb-6 lg:mb-8 px-4 lg:px-0">
        Discover opportunities that match your skills, passion, and career goals.
        Your next professional milestone is just a search away.
      </p>
    </div>
  );
});

// Memoize GridPattern
const MemoizedGridPattern = memo(GridPattern);

function HeroSection() {
  const navigate = useNavigate();
  const [jobQuery, setJobQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedJobQuery = jobQuery.trim();
    const trimmedLocationQuery = locationQuery.trim();

    const params = new URLSearchParams();
    if (trimmedJobQuery) params.append("keyword", trimmedJobQuery);
    if (trimmedLocationQuery) params.append("location", trimmedLocationQuery);

    navigate({
      pathname: "/browse",
      search: params.toString(),
    });
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4 py-8 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 items-center">
          <MemoizedGridPattern
            className="absolute inset-0 w-full h-full text-blue-200"
            style={{
              maskImage: "radial-gradient(circle, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%)",
              WebkitMaskImage: "radial-gradient(circle, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%)",
              opacity: 0.4,
            }}
          />

          <div className="container mx-auto px-4 lg:px-16 py-8 lg:py-12 relative z-10">
            <MemoizedHeroText />

            <div className="w-full max-w-2xl mx-auto lg:mx-0">
              <form onSubmit={handleSearch} className="space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-0">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={jobQuery}
                      onChange={(e) => setJobQuery(e.target.value)}
                      placeholder="Job title or skills"
                      className="w-full pl-12 pr-4 py-3 lg:py-4 text-base lg:text-lg outline-none border border-gray-200 rounded-full sm:rounded-l-full sm:rounded-r-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    />
                  </div>

                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="Location"
                      className="w-full pl-12 pr-4 py-3 lg:py-4 text-base lg:text-lg outline-none border border-gray-200 rounded-full sm:rounded-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white rounded-full sm:rounded-l-none px-6 lg:px-8 py-3 lg:py-4 h-auto transition transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Only render IconCloud on desktop */}
          {isDesktop && (
            <div className="hidden lg:block relative ">
              <Suspense fallback={<div>Loading...</div>}>
                <MemoizedIconCloud />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;