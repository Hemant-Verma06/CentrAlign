# AI-Powered Dynamic Form Generator

A full-stack Next.js application that uses Google Gemini AI to generate dynamic forms based on user prompts, with a context-aware memory layer using Pinecone to learn from past forms.

## Features

- **AI Form Generation**: Convert natural language prompts into JSON form schemas using Google Gemini.
- **Multimodal Support**: Upload images (sketches, examples) to guide the AI generation.
- **Context-Aware Memory**: Uses Pinecone vector database to retrieve relevant past forms and style the new form accordingly (RAG).
- **Dynamic Rendering**: Publicly shareable forms rendered from JSON schemas.
- **Submissions**: Collect and view form submissions with support for file uploads.
- **Authentication**: Secure email/password login with JWT.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas (Data), Pinecone (Vector Memory)
- **AI**: Google Gemini (`gemini-1.5-flash` for generation, `text-embedding-004` for embeddings)
- **Storage**: Cloudinary (Image uploads)

## Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd ai_form_generator
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Copy `.env.example` to `.env.local` and fill in your keys:
    ```bash
    cp .env.example .env.local
    ```
    Required keys:
    - `MONGODB_URI`: MongoDB connection string
    - `JWT_SECRET`: Secret for signing tokens
    - `GEMINI_API_KEY`: Google AI Studio API Key
    - `PINECONE_API_KEY`: Pinecone API Key
    - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary Cloud Name
    - `CLOUDINARY_API_KEY`: Cloudinary API Key
    - `CLOUDINARY_API_SECRET`: Cloudinary API Secret

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Architecture & Scalability

### Memory Retrieval (RAG)
To handle thousands of past forms efficiently, we use **Retrieval-Augmented Generation (RAG)**:
1.  **Storage**: When a form is created, we generate an embedding of its `purpose` using Gemini's embedding model and store it in Pinecone with metadata.
2.  **Retrieval**: When generating a new form, we embed the user's prompt and query Pinecone for the **Top-5** most semantically similar forms created by that user.
3.  **Generation**: We inject the summaries of these 5 forms into the Gemini system prompt. This allows the AI to "remember" the user's preferences and field patterns without sending the entire history (which would exceed token limits).

### Scalability
- **Vector Search**: Pinecone handles millions of vectors with low latency.
- **Token Optimization**: We only send a small slice of relevant context (Top-K), ensuring the prompt size remains constant regardless of history size.
- **Database**: MongoDB handles the structured data (schemas, submissions) separately from the vector search.

## Example Prompts

- "Create a job application form for a Senior React Developer."
- "I need a feedback survey for my coffee shop with a rating field."
- "Registration form for a hackathon with team size and project link."
