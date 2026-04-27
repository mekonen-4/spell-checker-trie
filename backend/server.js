const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Trie = require('./logic/Trie');

const app = express();
app.use(cors());
app.use(express.json());

const spellChecker = new Trie();

// 1. Load the dictionary JSON
console.log("Loading dictionary into memory...");
try {
    const rawData = fs.readFileSync('./data/words_dictionary.json');
    const dictionary = JSON.parse(rawData);
    
    // 2. Insert all keys (words) into the Trie
    Object.keys(dictionary).forEach(word => {
        spellChecker.insert(word);
    });
    console.log(`Successfully loaded ${Object.keys(dictionary).length} words into the Trie.`);
} catch (error) {
    console.error("Error loading dictionary. Make sure words_dictionary.json is in the /data folder.");
    process.exit(1);
}

// 3. API Endpoint
app.get('/api/check', (req, res) => {
    const { word } = req.query;
    
    if (!word) return res.json({ error: "No word provided" });

    const isCorrect = spellChecker.search(word);
    let suggestions = [];

    // Only calculate edit distance if the word is misspelled
    if (!isCorrect) {
        suggestions = spellChecker.getSuggestions(word);
    }

    res.json({ 
        word, 
        isCorrect, 
        suggestions: suggestions.slice(0, 10) // Limit to top 10 suggestions to keep UI clean
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));