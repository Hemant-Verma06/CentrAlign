import pinecone, { indexName } from './pinecone';
import { getEmbedding } from './embeddings';

export async function storeFormMemory(formId: string, userId: string, purpose: string, schemaSummary: string) {
    try {
        const embedding = getEmbedding(purpose); // Now uses local embedding
        const index = pinecone.index(indexName);

        await index.upsert([{
            id: formId,
            values: embedding,
            metadata: {
                userId,
                purpose,
                schemaSummary,
            }
        }]);
    } catch (error) {
        console.error('Error storing memory:', error);
        // Don't block the main flow if memory fails
    }
}

export async function retrieveRelevantForms(query: string, userId: string, topK: number = 5) {
    try {
        const embedding = getEmbedding(query); // Now uses local embedding
        const index = pinecone.index(indexName);

        const queryResponse = await index.query({
            vector: embedding,
            topK,
            filter: { userId: { $eq: userId } },
            includeMetadata: true,
        });

        return queryResponse.matches.map(match => match.metadata);
    } catch (error) {
        console.error('Error retrieving memory:', error);
        return [];
    }
}
