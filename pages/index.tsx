import { useState } from "react";
import Head from "next/head";

const TOP_PICKS = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN", "TSLA", "META", "NFLX", "AMD", "C"];

export default function Home() {
  const [symbol, setSymbol] = useState("AAPL");
  const [commentary, setCommentary] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter suggestions based on input
  const suggestions = symbol.length > 0
    ? TOP_PICKS.filter(
        (pick) => pick.startsWith(symbol.toUpperCase()) && pick !== symbol.toUpperCase()
      )
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value.toUpperCase());
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (pick: string) => {
    setSymbol(pick);
    setShowSuggestions(false);
  };

  const generate = async () => {
    setLoading(true);
    setCommentary("");
    const res = await fetch("/api/commentary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    });
    const data = await res.json();
    setCommentary(data.commentary);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>CitiSight</title>
        <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64," />
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500;700;900&family=Noto+Sans:wght@400;500;700;900"
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" async />
      </Head>

      <div
        className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
        style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
      >
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f5] px-10 py-3">
            <div className="flex items-center gap-4 text-[#111418]">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">CitiSight</h2>
            </div>
            <div className="flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <a className="text-[#111418] text-sm font-medium leading-normal" href="#">Home</a>
                <a className="text-[#111418] text-sm font-medium leading-normal" href="#">Research</a>
                <a className="text-[#111418] text-sm font-medium leading-normal" href="#">Portfolio</a>
                <a className="text-[#111418] text-sm font-medium leading-normal" href="#">News</a>
              </div>
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#f0f2f5] text-[#111418] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
                </svg>
              </button>
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBtbw1YnN_m2fOFmbCQ8Kn3ZaGnWCI7swydw2sGr6tkzKuZl6J-DpDvUxZeEh5MDLIbQjCjmcfC1C4gsTXOiJcuWeCPcsbvVCz_YWOiurb4pDZuMZfuXuEpRI2SOz5ZHOvnZd5p68glGPjdAooVwimEcISqQcjXMsTgbgXTgyPSPFm4Mp6R2wQIRzhiD2l5kw7KieQDkRH9CMdJdLs0_-xtXpaYEEprYSJmNwKovuaIOZHKNJ_SclfadwdZWp-4YGgpiOrhoGQPWrY")',
                }}
              />
            </div>
          </header>

          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
              <h2 className="text-[#111418] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
                Generate Stock Commentary
              </h2>

              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1 relative">
                  <span className="mb-2 text-sm font-medium text-[#60758a]">Stock Ticker</span>
                  <div className="relative">
                    <input
                      placeholder="Enter stock ticker (e.g., AAPL)"
                      className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] border bg-white h-14 placeholder:text-[#60758a] p-[15px] text-base font-normal leading-normal transition-all duration-200 focus:ring-2 focus:ring-[#0c7ff2] focus:border-[#0c7ff2] border-[#dbe0e6] shadow-sm hover:shadow-md ${loading ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      value={symbol}
                      onChange={handleInputChange}
                      disabled={loading}
                      maxLength={8}
                      autoFocus
                      autoComplete="off"
                      spellCheck={false}
                      inputMode="text"
                      pattern="[A-Za-z]{1,8}"
                      aria-label="Stock ticker"
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0c7ff2] pointer-events-none">
                      &#128200;
                    </span>
                    {/* Suggestions dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 mt-2 z-10 bg-white border border-[#dbe0e6] rounded-lg shadow-lg max-h-40 overflow-auto">
                        {suggestions.map((pick) => (
                          <li
                            key={pick}
                            className="px-4 py-2 cursor-pointer hover:bg-[#f0f2f5] text-[#0c7ff2] font-medium"
                            onMouseDown={() => handleSuggestionClick(pick)}
                          >
                            {pick}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <span className="mt-1 text-xs text-[#b0b8c1]">Only letters, max 8 characters.</span>
                </label>
              </div>

              {/* Top Picks Section */}
              <div className="px-4 py-2 mb-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-semibold text-[#0c7ff2]">Top Picks:</span>
                  {TOP_PICKS.slice(0, 6).map((pick) => (
                    <button
                      key={pick}
                      type="button"
                      className="px-3 py-1 rounded-full bg-[#f0f2f5] text-[#0c7ff2] font-medium text-xs hover:bg-[#e6f0fa] transition-colors duration-150 border border-[#e0e7ef]"
                      onClick={() => setSymbol(pick)}
                      disabled={loading}
                      aria-label={`Select ${pick}`}
                    >
                      {pick}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex px-4 py-3 justify-center">
                <button
                  onClick={generate}
                  disabled={loading}
                  className={`flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0c7ff2] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-transform duration-200 hover:scale-105 active:scale-95 relative ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading ? (
                    <>
                      <span className="inline-block mr-2">
                        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin align-[-0.125em]"></span>
                      </span>
                      Generating...
                    </>
                  ) : (
                    <span className="truncate">Generate Commentary</span>
                  )}
                </button>
              </div>

              {commentary && (
                <div className="px-4 py-4 mt-2 rounded bg-gray-100 whitespace-pre-wrap text-[#111418]">
                  {commentary}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.7s linear infinite;
        }
      `}</style>
    </>
  );
}
