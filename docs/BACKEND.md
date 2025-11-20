# 🗄️ Backend & Database Documentation

This document details the Convex backend architecture, including the database schema and the purpose of key server functions (queries, mutations, and actions).

## 1. Convex Overview

Convex serves as both our backend and real-time database. It provides:
-   **Serverless Functions:** Queries, Mutations, and Actions that run in the cloud.
-   **Real-time Database:** A document-based database with built-in reactivity.
-   **Authentication Integration:** Seamless integration with Clerk for secure user management.

## 2. Database Schema (`convex/schema.ts`)

The `schema.ts` file defines the structure and validation rules for our database tables. All fields are validated using Convex's `v` (validator) utility.

### `users` Table

Stores user profiles, synced from Clerk.

```typescript
{
  _id: v.id("users"),
  clerkId: v.string(), // Clerk's user ID
  name: v.string(),
  profileImage: v.string(),
  createdAt: v.number(),
}
```

### `decisions` Table

Stores high-level decision information.

```typescript
{
  _id: v.id("decisions"),
  userId: v.id("users"), // Reference to the user who owns the decision
  title: v.string(), // "Which phone should I buy?"
  createdAt: v.number(),
  updatedAt: v.number(),
  status: v.union(v.literal("in-progress"), v.literal("completed")),
  finalChoice: v.optional(v.string()),
  confidenceScore: v.optional(v.float64()),
}
```

### `decision_messages` Table

Stores the conversational history for each decision.

```typescript
{
  _id: v.id("decision_messages"),
  decisionId: v.id("decisions"), // Reference to the parent decision
  sender: v.union(v.literal("user"), v.literal("ai")),
  content: v.string(),
  createdAt: v.number(),
  // Optional: For AI-generated questions with clickable suggestions
  suggestions: v.optional(v.array(v.string())),
}
```

### `decision_context` Table

Stores the structured output of the AI's decision analysis (criteria, options, scores).

```typescript
{
  _id: v.id("decision_context"),
  decisionId: v.id("decisions"), // Reference to the parent decision
  modelUsed: v.literal("gemini-2.5-flash"),
  criteria: v.array(v.object({ name: v.string(), weight: v.float64() })),
  options: v.array(
    v.object({
      name: v.string(),
      pros: v.array(v.string()),
      cons: v.array(v.string()),
      score: v.float64(),
    })
  ),
  finalChoice: v.string(),
  confidenceScore: v.float64(),
  reasoning: v.string(),
  createdAt: v.number(),
}
```

## 3. Key Server Functions

Convex functions are categorized as Queries (read-only), Mutations (write-enabled), or Actions (can make external calls, e.g., to AI).

### `convex/users.ts`

-   `store`: (Mutation) Ensures the authenticated Clerk user exists in our `users` table. Called automatically on user login/signup.

### `convex/decisions.ts`

-   `createDecision`: (Mutation) Creates a new `decision` entry and initializes its title.
-   `getDecision`: (Query) Fetches a single decision by its ID.
-   `getDecisions`: (Query) Fetches all decisions for the authenticated user.
-   `updateDecisionStatus`: (Mutation) Updates the status of a decision (e.g., from "in-progress" to "completed").
-   `summarizeDecisionTitle`: (Action) Uses AI to generate a concise title for a decision based on the initial user message.

### `convex/messages.ts`

-   `addMessage`: (Mutation) Adds a new user or AI message to the `decision_messages` table.
-   `getMessagesForDecision`: (Query) Fetches all messages for a specific decision, ordered by creation time.

### `convex/ai.ts`

-   `getAiResponse`: (Action) The core AI integration point.
    -   Receives the current conversation history.
    -   Constructs a dynamic prompt based on the conversation state (information gathering vs. decision mode).
    -   Calls the Huawei Cloud AI model (DeepSeek V3.1).
    -   Parses the AI's structured JSON response.
    -   Updates the `decision_messages` or `decision_context` tables based on the AI's output.

This backend structure provides a robust, real-time foundation for the Orcasion application.
