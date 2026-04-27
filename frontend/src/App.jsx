import React from "react";
import SpellChecker from "./components/SpellChecker";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow">
        <SpellChecker />
      </main>
    </div>
  );
}

export default App;
