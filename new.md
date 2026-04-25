You are a senior full-stack engineer and AI infrastructure architect.

Help me build a **Mini NotebookLM-style web application with Retrieval-Augmented Generation (RAG)** using **Pinecone vector database** and deployable on:

Frontend → Vercel
Backend → Render

IMPORTANT CONSTRAINT:

Do NOT use Ollama anywhere in the system.

Use hosted LLM APIs only:

Anthropic Claude API (preferred)
or OpenAI API fallback

The system must be modular, production-ready, and scalable.

---

# SYSTEM GOAL

Build a NotebookLM-style application where users can:

Create notebooks
Upload documents
Chat with documents
Ask grounded questions
See sources used in answers
Maintain notebook-specific chat memory
Manage multiple notebooks

Each notebook must act as its own RAG workspace.

---

# REQUIRED TECH STACK

Frontend:

Next.js App Router
TypeScript
TailwindCSS
shadcn/ui
React Query
Zustand

Backend:

Node.js
TypeScript
Express OR Fastify

Database:

PostgreSQL (Render hosted)

Vector Database:

Pinecone

Embeddings:

OpenAI embeddings
OR Voyage embeddings
OR Anthropic embeddings (if supported)

LLM Providers:

Claude (primary)
OpenAI (fallback option)

Provider must be switchable using:

.env

Example:

LLM_PROVIDER=claude

---

# CORE SYSTEM ARCHITECTURE

Design system with layers:

Frontend UI Layer

Backend API Layer

RAG Pipeline Layer

Vector Storage Layer (Pinecone)

LLM Adapter Layer

Database Layer

Streaming Response Layer

Provide architecture diagram in text format.

---

# AUTHENTICATION SYSTEM

Implement:

JWT authentication

Endpoints:

POST /auth/register
POST /auth/login
GET /auth/me

Protect:

documents
chat
notebooks

Routes using middleware.

---

# NOTEBOOK SYSTEM

Each user can:

create notebook
rename notebook
delete notebook
list notebooks

Endpoints:

GET /notebooks
POST /notebooks
PATCH /notebooks/:id
DELETE /notebooks/:id

Each notebook must have:

id
title
ownerId
createdAt

---

# DOCUMENT INGESTION PIPELINE

Support uploads:

PDF
TXT
Markdown

Pipeline must:

upload file
parse content
chunk text
generate embeddings
store embeddings in Pinecone
store metadata in PostgreSQL

Metadata must include:

notebookId
fileName
chunkText
chunkIndex
pineconeVectorId

Use chunk size:

500–800 tokens

Overlap:

100 tokens

Explain why this size is chosen.

---

# PINECONE VECTOR STRUCTURE

Namespace must equal:

notebookId

Metadata must include:

documentId
chunkIndex
sourceFile
userId

Implement:

upsert vectors
delete notebook vectors
delete document vectors
query vectors

Provide Pinecone service layer code.

---

# RAG QUERY PIPELINE

When user sends question:

Step 1:

create embedding

Step 2:

query Pinecone namespace

Step 3:

retrieve top K chunks

K = 5 default

Step 4:

construct context window

Step 5:

send context + question to LLM

Step 6:

stream response back

Return:

answer
sourceChunks
confidence metadata

---

# CHAT SYSTEM

Chat must support:

multi-message conversation

per notebook memory

streaming tokens

persistent history

Endpoints:

POST /chat/query
GET /chat/history/:notebookId

Database schema must include:

messages table

fields:

id
notebookId
userId
role
content
sources
createdAt

---

# STREAMING REQUIREMENT

Chat responses must stream live tokens.

Implement using:

Server Sent Events (SSE)

OR

ReadableStream API

Frontend must render streaming response progressively.

---

# FRONTEND UI LAYOUT

Layout structure:

Left Sidebar:

notebook list
create notebook button

Top Navbar:

upload document button

Main Panel:

chat interface

Right Panel:

retrieved sources viewer

Components required:

ChatInput

ChatMessage

NotebookSidebar

UploadDialog

SourcesPanel

StreamingResponseRenderer

---

# STATE MANAGEMENT

Use:

Zustand

Store:

current notebook

chat history

document list

loading states

---

# API CLIENT STRUCTURE

Create:

/lib/apiClient.ts

Centralized fetch wrapper

Must support:

auth token injection

error handling

stream parsing

---

# DATABASE SCHEMA

Tables required:

users

notebooks

documents

messages

Provide SQL schema definitions.

---

# FILE STORAGE STRATEGY

Use:

Render disk storage

OR

Cloudinary

OR

S3-compatible storage

Explain which is best for production deployment.

---

# AI PROVIDER ABSTRACTION LAYER

Create:

/services/aiProvider.ts

Supports:

Claude

OpenAI

Switch using:

.env

Example:

LLM_PROVIDER=claude

Expose functions:

generateResponse()

generateStreamingResponse()

generateEmbeddings()

---

# ENVIRONMENT VARIABLES

Backend:

DATABASE_URL=

JWT_SECRET=

PINECONE_API_KEY=

PINECONE_INDEX=

OPENAI_API_KEY=

ANTHROPIC_API_KEY=

LLM_PROVIDER=

EMBEDDING_PROVIDER=

Frontend:

NEXT_PUBLIC_API_URL=

---

# ERROR HANDLING REQUIREMENTS

Handle:

vector query failures

embedding failures

LLM failures

expired tokens

file parsing errors

Return structured errors:

status

message

resolution suggestion

---

# DEPLOYMENT REQUIREMENTS

Provide step-by-step instructions for:

Deploy backend on Render

Deploy frontend on Vercel

Include:

build command

start command

environment setup

database setup

pinecone setup

---

# PERFORMANCE OPTIMIZATION

Implement:

request caching

embedding batching

context window trimming

token usage logging

retry strategy

rate-limit handling

---

# SECURITY REQUIREMENTS

Add:

JWT middleware

input validation

file upload validation

rate limiting

CORS protection

helmet middleware

---

# OUTPUT FORMAT REQUIRED

Produce:

1 architecture diagram

2 backend folder structure

3 frontend folder structure

4 database schema SQL

5 Pinecone integration service

6 embedding pipeline code

7 RAG retrieval logic

8 streaming chat implementation

9 authentication implementation

10 deployment guide Render

11 deployment guide Vercel

12 production improvement roadmap

Do NOT skip implementation details.

Produce working code.
