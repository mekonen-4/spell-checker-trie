class TrieNode {
    constructor() {
        this.children = {}; 
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
        // REQUIREMENT: Hash Map to store word frequencies for O(1) retrieval
        this.wordFrequencies = new Map(); 
    }

    /**
     * Core Feature: Insert words into the dictionary
     * Complexity: O(L) where L is the length of the word
     */
    insert(word, frequency = 1) {
        let node = this.root;
        const lowerWord = word.toLowerCase();

        for (let char of lowerWord) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;

        // Update our Hash Map (Frequency tracking)
        if (this.wordFrequencies.has(lowerWord)) {
            this.wordFrequencies.set(lowerWord, this.wordFrequencies.get(lowerWord) + 1);
        } else {
            this.wordFrequencies.set(lowerWord, frequency);
        }
    }

    /**
     * Core Feature: Check if a word is spelled correctly
     * Complexity: O(L)
     */
    search(word) {
        let node = this.root;
        for (let char of word.toLowerCase()) {
            if (!node.children[char]) return false;
            node = node.children[char];
        }
        return node.isEndOfWord;
    }

    /**
     * Core Feature: Suggest corrections (Edit Distance 1)
     * Requirement: Uses Hash Map for ranking suggestions
     */
    getSuggestions(word) {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        let candidates = new Set();
        const w = word.toLowerCase();

        for (let i = 0; i <= w.length; i++) {
            // 1. Deletion
            if (i < w.length) {
                candidates.add(w.slice(0, i) + w.slice(i + 1));
            }
            // 2. Substitution & 3. Insertion
            for (let char of alphabet) {
                if (i < w.length) {
                    candidates.add(w.slice(0, i) + char + w.slice(i + 1)); 
                }
                candidates.add(w.slice(0, i) + char + w.slice(i));     
            }
        }

        // Filter valid words and then RANK them using our Hash Map
        return Array.from(candidates)
            .filter(candidate => this.search(candidate))
            .sort((a, b) => {
                const freqA = this.wordFrequencies.get(a) || 0;
                const freqB = this.wordFrequencies.get(b) || 0;
                return freqB - freqA; // Descending order (highest frequency first)
            });
    }
}

module.exports = Trie;