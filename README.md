# AI-Powered Dynamic Form Generator

A full-stack Next.js application that uses Google Gemini AI to generate dynamic forms from user prompts, with context-aware memory using Pinecone to learn from past forms.

---

## Features

- **AI Form Generation**: Convert natural language prompts into JSON form schemas using Google Gemini.
- **Multimodal Support**: Upload images (sketches, examples) to guide the AI generation.
- **Context-Aware Memory**: Uses Pinecone vector database to retrieve relevant past forms and style the new form accordingly (RAG).
- **Dynamic Rendering**: Publicly shareable forms rendered from JSON schemas.
- **Submissions**: Collect and view form submissions with support for file uploads.
- **Authentication**: Secure email/password login with JWT.

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas (Data), Pinecone (Vector Memory)
- **AI**: Use Groq for form Generation
- **Storage**: Cloudinary (Image uploads)

---

## Setup Instructions

1. **Clone the repository**
   `bash
    git clone <repo-url>
    cd ai_form_generator
    `

2. **Install Dependencies**
   `bash
    npm install
    `

3. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your keys:
   `bash
    cp .env.example .env.local
    `
   Required keys: - `MONGODB_URI`: MongoDB connection string - `JWT_SECRET`: Secret for signing tokens - GROQ API KRY `GEMINI_API_KEY`: Google AI Studio API Key - `PINECONE_API_KEY`: Pinecone API Key - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary Cloud Name - `CLOUDINARY_API_KEY`: Cloudinary API Key - `CLOUDINARY_API_SECRET`: Cloudinary API Secret

4. **Run Development Server**
   `bash
    npm run dev
    `
   Open [http://localhost:3000](http://localhost:3000).

---

## Example Prompts & Generated Form Samples

**Prompt:**

> Create a job application form - ['https://centr-align.vercel.app/form/692acd3f536e03ec2ac23796']

**Prompt:**

> Bio Data Form - ['https://centr-align.vercel.app/form/692ad860fed6b2c6d9e16fbd']

---

## Architecture Notes: Memory Retrieval (RAG)

To handle thousands of past forms efficiently, we use **Retrieval-Augmented Generation (RAG)**:

1. **Storage**: When a form is created, we generate an embedding of using TF-IDF (gemini api limit reached so I have to fall back on this method). Initially I was planning to store purpose of the form using Gemini API.
2. **Retrieval**: When generating a new form, we embed the user's prompt and query Pinecone for the **Top-5** most semantically similar forms created by that user.
3. **Generation**: We inject the summaries of these 5 forms into the Gemini system prompt. This allows the AI to "remember" the user's preferences and field patterns without sending the entire history (which would exceed token limits).

---

## Scalability Handling

- **Vector Search**: Pinecone handles millions of vectors with low latency.
- **Token Optimization**: Only a small slice of relevant context (Top-K) is sent, keeping prompt size constant regardless of history size.
- **Database**: MongoDB stores structured data (schemas, submissions) separately from the vector search.

---

## Limitations

- **AI Generation Quality**: Generated forms depend on the quality of the prompt and available context.
- **Image Guidance**: Image-based guidance is limited to what the AI model supports. (It stopped because my limit is reached. I have added the functionality but it is not working as it should.)
- **Authentication**: Only email/password login is supported (no Google login).
- **File Uploads**: Limited to supported file types and Cloudinary configuration.

---

## Future Improvements

- Add support for OAuth/social login (Google, GitHub, etc.)
- Improve form field validation and customization
- Add analytics dashboard for form submissions
- Enhance AI prompt engineering for more complex forms
- Support for multi-page forms and conditional logic
- Better error handling and user feedback
- Add admin panel for managing users and forms

---
