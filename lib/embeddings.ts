// Simple local embedding function (no API calls needed)
// Uses a basic TF-IDF-like approach with word hashing

export function getEmbedding(text: string): number[] {
    const dimension = 384; // Smaller dimension for efficiency
    const embedding = new Array(dimension).fill(0);

    // Normalize and tokenize
    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2);

    // Simple hash-based embedding
    words.forEach((word, idx) => {
        // Create multiple hash values for each word
        for (let i = 0; i < 3; i++) {
            const hash = simpleHash(word + i);
            const position = Math.abs(hash) % dimension;
            // Weighted by position (earlier words have more weight)
            const weight = 1.0 / (1 + Math.log(idx + 1));
            embedding[position] += weight;
        }
    });

    // Normalize the vector
    const magnitude = Math.sqrt(
        embedding.reduce((sum, val) => sum + val * val, 0)
    );

    if (magnitude > 0) {
        for (let i = 0; i < dimension; i++) {
            embedding[i] /= magnitude;
        }
    }

    return embedding;
}

// Simple hash function
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
}
