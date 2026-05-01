import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  CheckCircle,
  AlertCircle,
  Users,
  GraduationCap,
  PlusCircle, // Added for the "Add Word" feature
} from "lucide-react";

const SpellChecker = () => {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(""); // For "Word Added" success messages

  const members = [
    "Mekonen Gebreslassie",
    "Biruk Amserom",
    "Dejen Mulu",
    "Teamr kahsay",
    "Sara Gedamu",
    "Rodas Hagos",
    "Semere Tsegab",
  ];

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    "https://spell-checker-trie-1.onrender.com/api";

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (input.trim().length > 0) {
        checkSpelling(input.trim());
      } else {
        setStatus(null);
        setFeedback("");
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [input]);

  const checkSpelling = async (word) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/check?word=${word}`);
      setStatus(data);
    } catch (error) {
      console.error("API Error:", error);
    }
    setLoading(false);
  };

  // NEW: Fulfills "Learn from user corrections" requirement
  const handleSuggestionClick = async (suggestion) => {
    setInput(suggestion);
    try {
      await axios.post(`${API_BASE}/learn`, { word: suggestion });
      console.log(`Learned frequency for: ${suggestion}`);
    } catch (error) {
      console.error("Learn error:", error);
    }
  };

  // NEW: Fulfills "Insert words into the dictionary" requirement
  const handleAddWord = async () => {
    if (!input) return;
    try {
      await axios.post(`${API_BASE}/add-word`, { word: input });
      setFeedback(`"${input}" added to dictionary!`);
      checkSpelling(input); // Refresh status
    } catch (error) {
      console.error("Add word error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12 px-4">
      {/* Academic Header */}
      <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
        <div className="flex justify-center mb-4">
          <GraduationCap
            size={48}
            className="text-blue-700 w-10 h-10 md:w-12 md:h-12"
          />
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase px-2">
          Mekelle University
        </h1>
        <h2 className="text-lg md:text-xl font-semibold text-blue-700 mt-2 px-4">
          DSA Project: Spell Checker using Trie Data Structure
        </h2>
        <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-bold uppercase tracking-widest text-xs">
          Group 4
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main: Spell Checker UI */}
        <div className="lg:col-span-2 order-1 lg:order-2 bg-white p-5 md:p-8 rounded-xl shadow-lg border border-gray-100">
          {/* Success Feedback Toast */}
          {feedback && (
            <div className="mb-4 p-3 bg-blue-600 text-white text-sm rounded-lg animate-bounce flex items-center gap-2">
              <CheckCircle size={16} /> {feedback}
            </div>
          )}

          <div className="relative mb-6">
            <input
              type="text"
              className={`w-full p-4 md:p-5 pr-12 md:pr-14 text-lg md:text-xl rounded-xl border-2 focus:outline-none transition-all
                ${
                  status === null
                    ? "border-gray-200 focus:border-blue-500 shadow-sm"
                    : status.isCorrect
                      ? "border-green-400 bg-green-50"
                      : "border-red-400 bg-red-50"
                }`}
              placeholder="Type a word..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setFeedback(""); // Clear feedback when user types
              }}
            />

            <div className="absolute right-4 md:right-5 top-4 md:top-5">
              {loading ? (
                <div className="animate-spin h-6 w-6 md:h-7 md:w-7 border-3 border-blue-600 border-t-transparent rounded-full"></div>
              ) : status?.isCorrect ? (
                <CheckCircle className="text-green-600 h-6 w-6 md:h-7 md:w-7" />
              ) : status?.isCorrect === false ? (
                <AlertCircle className="text-red-600 h-6 w-6 md:h-7 md:w-7" />
              ) : (
                <Search className="text-gray-400 h-6 w-6 md:h-7 md:w-7" />
              )}
            </div>
          </div>

          {/* Feedback and Suggestions */}
          {status?.isCorrect === false && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-4 md:p-5 bg-white border-2 border-red-100 rounded-xl shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-red-800 font-semibold text-base md:text-lg">
                    Correction Suggested:
                  </p>
                  {/* NEW: Add word functionality */}
                  <button
                    onClick={handleAddWord}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-tighter"
                  >
                    <PlusCircle size={14} /> Add "{input}" to dictionary
                  </button>
                </div>

                {status.suggestions.length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {status.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="bg-red-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-red-700 border border-red-200 text-sm md:text-base font-medium hover:bg-red-600 hover:text-white hover:border-red-600 transition-all transform hover:-translate-y-1 active:scale-95 shadow-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">
                    No valid dictionary matches for distance d=1.
                  </p>
                )}
              </div>
            </div>
          )}

          {status?.isCorrect && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg font-medium flex items-center gap-2 text-sm md:text-base">
              <CheckCircle size={20} /> "{status.word}" is correctly spelled!
            </div>
          )}
        </div>

        {/* Sidebar: Members List */}
        <div className="lg:col-span-1 order-2 lg:order-1 bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
            <Users size={20} className="text-blue-600" />
            Project Members
          </h3>
          <ul className="space-y-3">
            {members.map((name, index) => (
              <li
                key={index}
                className="text-gray-600 text-sm md:text-base flex items-center gap-3"
              >
                <span className="bg-gray-100 text-gray-500 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                  {index + 1}
                </span>
                <span className="truncate">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 md:mt-16 text-center text-gray-400 text-xs md:text-sm px-4">
        &copy; 2026 Mekelle University | Software Engineering, section 3-Group 4
        | Data Structures & Algorithms
      </footer>
    </div>
  );
};

export default SpellChecker;
