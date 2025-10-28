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







Example: Next.js with Convex and Clerk

This guide assumes you already have a working Next.js app with Convex. If not follow the Convex Next.js Quickstart first. Then:

Sign up for Clerk
Sign up for a free Clerk account at clerk.com/sign-up.

Sign up to Clerk

Create an application in Clerk
Choose how you want your users to sign in.

Create a Clerk application

Create a JWT Template
In the Clerk Dashboard, navigate to the JWT templates page.

Select New template and then from the list of templates, select Convex. You'll be redirected to the template's settings page. Do NOT rename the JWT token. It must be called convex.

Copy and save the Issuer URL somewhere secure. This URL is the issuer domain for Clerk's JWT templates, which is your Clerk app's Frontend API URL. In development, it's format will be https://verb-noun-00.clerk.accounts.dev. In production, it's format will be https://clerk.<your-domain>.com.

Create a JWT template

Configure Convex with the Clerk issuer domain
In your app's convex folder, create a new file auth.config.ts with the following code. This is the server-side configuration for validating access tokens.

convex/auth.config.ts
TS
import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      // Replace with your own Clerk Issuer URL from your "convex" JWT template
      // or with `process.env.CLERK_JWT_ISSUER_DOMAIN`
      // and configure CLERK_JWT_ISSUER_DOMAIN on the Convex Dashboard
      // See https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;


Deploy your changes
Run npx convex dev to automatically sync your configuration to your backend.

npx convex dev

Install clerk
In a new terminal window, install the Clerk Next.js SDK:

npm install @clerk/nextjs

Set your Clerk API keys
In the Clerk Dashboard, navigate to the API keys page. In the Quick Copy section, copy your Clerk Publishable and Secret Keys and set them as the NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY environment variables, respectively.

.env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY

Add Clerk middleware
Clerk's clerkMiddleware() helper grants you access to user authentication state throughout your app.

Create a middleware.ts file.

In your middleware.ts file, export the clerkMiddleware() helper:

import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}


By default, clerkMiddleware() will not protect any routes. All routes are public and you must opt-in to protection for routes.https://clerk.com/docs/references/nextjs/clerk-middleware) to learn how to require authentication for specific routes.

Configure ConvexProviderWithClerk
Both Clerk and Convex have provider components that are required to provide authentication and client context.

Typically, you'd replace <ConvexProvider> with <ConvexProviderWithClerk>, but with Next.js App Router, things are a bit more complex.

<ConvexProviderWithClerk> calls ConvexReactClient() to get Convex's client, so it must be used in a Client Component. Your app/layout.tsx, where you would use <ConvexProviderWithClerk>, is a Server Component, and a Server Component cannot contain Client Component code. To solve this, you must first create a wrapper Client Component around <ConvexProviderWithClerk>.

'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/nextjs'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}


Wrap your app in Clerk and Convex
Now, your Server Component, app/layout.tsx, can render <ConvexClientProvider> instead of rendering <ConvexProviderWithClerk> directly. It's important that <ClerkProvider> wraps <ConvexClientProvider>, and not the other way around, as Convex needs to be able to access the Clerk context.

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/ConvexClientProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Clerk Next.js Quickstart',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}


Show UI based on authentication state
You can control which UI is shown when the user is signed in or signed out using Convex's <Authenticated>, <Unauthenticated> and <AuthLoading> helper components. These should be used instead of Clerk's <SignedIn>, <SignedOut> and <ClerkLoading> components, respectively.

It's important to use the useConvexAuth() hook instead of Clerk's useAuth() hook when you need to check whether the user is logged in or not. The useConvexAuth() hook makes sure that the browser has fetched the auth token needed to make authenticated requests to your Convex backend, and that the Convex backend has validated it.

In the following example, the <Content /> component is a child of <Authenticated>, so its content and any of its child components are guaranteed to have an authenticated user, and Convex queries can require authentication.

app/page.tsx
TS
"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  return (
    <>
      <Authenticated>
        <UserButton />
        <Content />
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </>
  );
}

function Content() {
  const messages = useQuery(api.messages.getForCurrentUser);
  return <div>Authenticated content: {messages?.length}</div>;
}

Use authentication state in your Convex functions
If the client is authenticated, you can access the information stored in the JWT via ctx.auth.getUserIdentity.

If the client isn't authenticated, ctx.auth.getUserIdentity will return null.

Make sure that the component calling this query is a child of <Authenticated> from convex/react. Otherwise, it will throw on page load.

convex/messages.ts
TS
import { query } from "./_generated/server";

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("author"), identity.email))
      .collect();
  },
});