# Convex

Convex is an open-source reactive database and serverless platform for building dynamic, live-updating web applications with TypeScript. It provides a full-stack development experience with features like server functions, data storage, and end-to-end type safety.

## Installation and Setup

### Install Convex Package

```bash
# Initialize npm project if needed
npm init -y

# Install Convex
npm install convex
```

### Install Convex Client

```bash
# For React projects
cd my-app && npm install convex

# For script tag usage
npm install convex
```

### Install Convex Backend Client

```bash
npm init -y
npm install convex
```

### Install AuthKit Dependencies

```bash
# For React
npm install @workos-inc/authkit-react @convex-dev/workos

# For Next.js
npm install @workos-inc/authkit-nextjs @convex-dev/workos
```

### Install Agent Component

```bash
npm install @convex-dev/agent
```

## Development Commands

### Start Convex Development Server

```bash
npx convex dev
```

### Start Convex Dev Deployment

```bash
# For various frameworks
npx convex dev

# For Bun
bunx convex dev
```

### Start Development Server

```bash
# For Next.js
npm run dev

# For React
npm run dev

# For Svelte
npm run dev

# For Remix
npm run dev

# For TanStack Start
npm run dev
```

### Run Local Backend

```bash
just run-local-backend
```

## Framework Integration

### Next.js Integration

```bash
# Create Next.js project with Convex
npx create-next-app@latest my-app
cd my-app
npm install convex

# Start development
npm run dev
```

### React Integration

```bash
# Create React app
npx create-react-app my-app
cd my-app
npm install convex

# Start development
npm run dev
```

### Svelte Integration

```bash
# Create Svelte project
npm create svelte@latest my-app
cd my-app
npm install convex

# Start development
npm run dev
```

### Remix Integration

```bash
# Create Remix project
npx create-remix@latest my-app
cd my-app
npm install convex

# Set up Convex dev deployment
npx convex dev

# Start development
npm run dev
```

### TanStack Start Integration

```bash
# Create TanStack Start project with Convex
npm create convex@latest -- -t tanstack-start

# Install dependencies
npm install convex @convex-dev/react-query @tanstack/react-router-with-query @tanstack/react-query

# Start development
npm run dev
```

### Vue Integration

```bash
# Set up Convex dev deployment
npx convex dev

# Start development
npm run dev
```

### Android Integration

```bash
# Install Convex backend client
npm init -y
npm install convex
```

### Swift Integration

```bash
# Install Convex backend
npm init -y
npm install convex

# Start Convex dev deployment
npx convex dev
```

### React Native Integration

```bash
# Create React Native project
npx create-expo-app my-app
cd my-app
npm install convex

# Start development
npm start
```

## Demo Applications

### Install and Run Convex App

```bash
# General pattern for most demos
npm install
npm run dev
```

### Specific Demo Examples

```bash
# GIPHY Action Example
npm install
npm run dev

# Pagination Example
npm install
npm run dev

# Scheduling Example
npm install
npm run dev

# Search Example
npm install
npm run dev

# Sessions Example
npm install
npm run dev

# File Storage Example
npm install
npm run dev

# React Query Example
npm install
npm run dev

# Cron Jobs Example
npm install
npm run dev

# HTTP Action Example
npm install
npm run dev

# Vector Search Example
npm install
npm run dev

# Tour Chat Example
npm install
npm run dev

# Next.js App Router Example
npm install
npm run dev

# Users and Clerk Example
npm install
npm run dev

# Custom Errors Example
npm install
npm run dev

# Zod Validation TypeScript Example
npm install
npm run dev
```

## Agent Integration

### Install and Run Agent Example

```bash
# Clone and run agent example
git clone https://github.com/get-convex/agent.git
cd agent
npm run setup
npm run example
```

### Customize Agent with Tools and Models

```typescript
import { tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { Agent, createTool } from "@convex-dev/agent";
import { components } from "./_generated/api";

// Define an agent similarly to the AI SDK
const supportAgent = new Agent(components.agent, {
  // The chat completions model to use for the agent.
  chat: openai.chat("gpt-4o-mini"),
  // The default system prompt if not over-ridden.
  instructions: "You are a helpful assistant.",
  tools: {
    // Convex tool
    myConvexTool: createTool({
      description: "My Convex tool",
      args: z.object({...}),
      // Note: annotate the return type of the handler to avoid type cycles.
      handler: async (ctx, args): Promise<string> => {
        return "Hello, world!";
      },
    }),
    // Standard AI SDK tool
    myTool: tool({ description, parameters, execute: () => {}}),
  },
  // Embedding model to power vector search of message history (RAG).
  textEmbedding: openai.embedding("text-embedding-3-small"),
  // Used for fetching context messages. See https://docs.convex.dev/agents/context
  contextOptions,
  // Used for storing messages. See https://docs.convex.dev/agents/messages
  storageOptions,
  // Used for limiting the number of steps when tool calls are involved.
  // NOTE: if you want tool calls to happen automatically with a single call,
  // you need to set this to something greater than 1 (the default).
  maxSteps: 1,
  // Used for limiting the number of retries when a tool call fails. Default: 3.
  maxRetries: 3,
  // Used for tracking token usage. See https://docs.convex.dev/agents/usage-tracking
  usageHandler: async (ctx, { model, usage }) => {
    // ... log, save usage to your database, etc.
  },
});
```

## Configuration

### Vite Configuration Example

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
```

### Sample Data for Convex Database

```jsonl
{"text": "Buy groceries", "completed": false}
{"text": "Walk the dog", "completed": false}
{"text": "Learn Convex", "completed": true}
```

### Convex OAuth Authorization Callback Example

```jsx
https://yourapp.example.com/cb?code=[CODE]&state=[STATE]
```

### Convex OAuth Token Response Example

```jsx
{
	"access_token": "team:my-team|AAAAAA==",
	"token_type": "bearer"
}
```

## Deployment

### Pushing Code to Convex Backend

```bash
# Push to dev backend
CONVEX_DEPLOY_KEY="YOUR_DEPLOY_KEY" npx convex dev --once

# Push to prod backend
CONVEX_DEPLOY_KEY="YOUR_DEPLOY_KEY" npx convex deploy
```

## IDE Integration

### Convex AI Rules for IDEs

```text
See these documents for install instructions:

- [Cursor](/ai/using-cursor.mdx#add-convex-cursorrules)
- [Windsurf](/ai/using-windsurf.mdx#add-convex-rules)
- [GitHub Copilot](/ai/using-github-copilot.mdx#add-convex-instructions)

For all other IDEs, add the following rules file to your project and refer to it when prompting for changes:

- [convex_rules.txt](https://convex.link/convex_rules.txt)
```

### Initial Query Result Example

```json
[
  { _id: "e4g", title: "Grocery shopping", complete: false },
  { _id: "u9v", title: "Plant new flowers", complete: false },
];
```

## Summary

Convex provides a comprehensive full-stack development platform with a reactive database, serverless functions, and end-to-end TypeScript support. The platform integrates seamlessly with various frontend frameworks including React, Next.js, Svelte, Remix, and more. Convex offers features like real-time data synchronization, built-in authentication, vector search capabilities, and agent integration for AI-powered applications. The development workflow is streamlined with the Convex CLI handling project setup, authentication, and deployment, making it easy to build and deploy modern web applications.