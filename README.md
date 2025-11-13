# Orcasion

**"Decide smarter. Live louder."**

Orcasion is an intelligent conversational assistant designed to help users make confident decisions. It uses a powerful AI to understand user needs, gather context through a natural conversation, and deliver clear, actionable recommendations.

## 🚀 Core Features

- **Conversational Decision Flow:** A chat-like interface that guides users through the decision-making process.
- **Inquisitive AI:** The AI proactively asks clarifying questions and provides suggested answers to quickly gather context.
- **Decision Matrix Engine:** The AI automatically generates a structured analysis of options, criteria, pros, and cons.
- **AI Recommendation Report:** A visually organized report presenting the final recommendation, confidence score, and detailed reasoning.
- **Custom Authentication:** A fully branded and seamless sign-in/sign-up experience.
- **Separated App/Guest Layouts:** A professional architecture that provides distinct experiences for authenticated and unauthenticated users.

## 🛠️ Tech Stack

| Component             | Technology                                       |
| --------------------- | ------------------------------------------------ |
| **Frontend**          | [Next.js](https://nextjs.org/) (App Router) + [React](https://react.dev/) |
| **Styling**           | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Backend & Database**| [Convex](https://www.convex.dev/) (Serverless Functions + Realtime DB) |
| **Authentication**    | [Clerk](https://clerk.com/) (Headless Hooks for Custom UI) |
| **AI Reasoning**      | Huawei Cloud ModelArts (DeepSeek V3.1 / Qwen 3)  |
| **Deployment**        | Vercel (Frontend) + Convex (Backend)             |
| **Package Manager**   | [pnpm](https://pnpm.io/)                         |

## ⚙️ Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Prerequisites

- Node.js (v18 or later)
- pnpm (`npm install -g pnpm`)
- A Convex account
- A Clerk account
- Access to a Huawei Cloud AI model API key

### 2. Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/orcasion.git
    cd orcasion
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### 3. Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Convex
NEXT_PUBLIC_CONVEX_URL=

# Huawei Cloud AI
DEEPSEEK_API_KEY=
```

You will get these values from your Clerk, Convex, and Huawei Cloud dashboards.

### 4. Running the Development Servers

You need to run two processes in separate terminals:

1.  **Run the Convex backend:**
    This command syncs your backend functions with the Convex service and watches for changes.
    ```bash
    npx convex dev
    ```

2.  **Run the Next.js frontend:**
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📂 Project Structure

The project is organized into two main parts: the Convex backend and the Next.js frontend.

-   `convex/`: Contains all backend logic, including database schema definitions, server functions (queries, mutations), and AI integration actions.
-   `src/`: Contains the entire Next.js frontend application.
    -   `src/app/`: The core of the application, using the Next.js App Router.
    -   `src/components/`: Contains all reusable React components, including UI elements built with `shadcn/ui`.
    -   `src/lib/`: Contains utility functions and library configurations.

## 📚 Detailed Documentation

For a deeper understanding of the project's architecture and key components, please refer to the detailed documentation:

-   [**AI Integration**](./docs/AI_INTEGRATION.md)
-   [**Authentication**](./docs/AUTHENTICATION.md)
-   [**Backend & Database**](./docs/BACKEND.md)
-   [**Frontend Architecture**](./docs/FRONTEND.md)
