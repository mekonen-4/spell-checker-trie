const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Trie = require('./logic/Trie');

const app = express();
app.use(cors());
app.use(express.json()); // Essential for parsing POST request bodies

const spellChecker = new Trie();

// 1. Load the dictionary JSON
console.log("Loading dictionary into memory...");
try {
    const rawData = fs.readFileSync('./data/words_dictionary.json');
    const dictionary = JSON.parse(rawData);
    
    // We use a default frequency of 1 for the initial load
    Object.keys(dictionary).forEach(word => {
        spellChecker.insert(word, 1); 
    });
    console.log(`Successfully loaded ${Object.keys(dictionary).length} words into the Trie.`);
} catch (error) {
    console.error("Error loading dictionary. Make sure words_dictionary.json is in the /data folder.");
    process.exit(1);
}

/**
 * FEATURE: Check and Suggest (GET)
 * Logic: O(L) for search, then ranks suggestions using Hash Map frequencies
 */
app.get('/api/check', (req, res) => {
    const { word } = req.query;
    if (!word) return res.status(400).json({ error: "No word provided" });

    const isCorrect = spellChecker.search(word);
    let suggestions = [];

    if (!isCorrect) {
        suggestions = spellChecker.getSuggestions(word);
    }

    res.json({ 
        word, 
        isCorrect, 
        suggestions: suggestions.slice(0, 10) 
    });
});

/**
 * REQUIREMENT: Insert words into the dictionary (POST)
 * This allows the user to expand the dictionary during runtime.
 */
app.post('/api/add-word', (req, res) => {
    const { word } = req.body;
    if (!word) return res.status(400).json({ error: "Word is required" });

    // This updates BOTH the Trie and the Hash Map
    spellChecker.insert(word); 
    
    console.log(`User added new word: ${word}`);
    res.json({ message: `"${word}" added to dictionary and ranked.` });
});

/**
 * OPTIONAL REQUIREMENT: Learn from user corrections
 * When a user clicks a suggestion in the UI, we tell the backend to increment its frequency.
 */
app.post('/api/learn', (req, res) => {
    const { word } = req.body;
    if (!word) return res.status(400).json({ error: "Word is required" });

    // Re-inserting the word increments its frequency in our internal Hash Map
    spellChecker.insert(word); 

    res.json({ message: `Learned! "${word}" will now rank higher in future suggestions.` });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));