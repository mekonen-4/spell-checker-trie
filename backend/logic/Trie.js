class TrieNode {
    constructor() {
        this.children = {}; 
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        // Convert to lowercase to ensure consistency
        for (let char of word.toLowerCase()) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    search(word) {
        let node = this.root;
        for (let char of word.toLowerCase()) {
            if (!node.children[char]) return false;
            node = node.children[char];
        }
        return node.isEndOfWord;
    }

    getSuggestions(word) {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        let results = new Set(); // Use a Set to prevent duplicate suggestions
        word = word.toLowerCase();

        for (let i = 0; i <= word.length; i++) {
            // 1. Deletion (e.g., 'cat' -> 'at', 'ct', 'ca')
            if (i < word.length) {
                results.add(word.slice(0, i) + word.slice(i + 1));
            }
            // 2. Substitution & 3. Insertion
            for (let char of alphabet) {
                // Substitution (e.g., 'cat' -> 'bat')
                if (i < word.length) {
                    results.add(word.slice(0, i) + char + word.slice(i + 1)); 
                }
                // Insertion (e.g., 'cat' -> 'cart')
                results.add(word.slice(0, i) + char + word.slice(i));     
            }
        }

        // Filter out the generated words that don't actually exist in our Trie
        return Array.from(results).filter(w => this.search(w));
    }
}

module.exports = Trie;