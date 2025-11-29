import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});

const indexName = 'ai-form-memory';

async function createIndex() {
  try {
    console.log('Checking if index exists...');
    const indexes = await pinecone.listIndexes();
    const indexExists = indexes.indexes?.some(index => index.name === indexName);

    if (indexExists) {
      console.log(`Index "${indexName}" already exists.`);
      console.log('Deleting old index to recreate with new dimension...');
      await pinecone.deleteIndex(indexName);
      console.log('Waiting for deletion...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log(`Creating index "${indexName}" with dimension 384...`);
    await pinecone.createIndex({
      name: indexName,
      dimension: 384, // Updated to match our local embeddings
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1',
        },
      },
    });

    console.log(`✓ Index "${indexName}" created successfully!`);
    console.log('Note: It may take a few minutes for the index to be fully ready.');
  } catch (error) {
    console.error('Error creating index:', error);
  }
}

createIndex();
