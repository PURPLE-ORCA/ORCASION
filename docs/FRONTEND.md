# 🖥️ Frontend Architecture Documentation

This document outlines the frontend architecture of Orcasion, built with Next.js (App Router), React, Tailwind CSS, and `shadcn/ui`.

## 1. Next.js App Router Structure

Orcasion leverages the Next.js App Router for its routing and rendering strategy. Key directories and their purposes:

-   `src/app/`:
    -   `layout.tsx`: The root layout, responsible for global providers (Clerk, Convex) and basic HTML structure. It *does not* contain application-specific UI like the sidebar.
    -   `page.tsx`: The main landing page, which conditionally renders either the `GuestLayout` or `AppLayout` based on user authentication status.
    -   `decision/[decisionId]/page.tsx`: The dynamic route for individual decision chats and reports.
    -   `sign-in/[[...sign-in]]/page.tsx` & `sign-up/[[...sign-up]]/page.tsx`: Custom authentication pages, replacing Clerk's default UI.
    -   `globals.css`: Global Tailwind CSS styles and custom utility classes (e.g., `.hide-scrollbar`).

## 2. Layout Strategy: Guest vs. App

To provide distinct user experiences, Orcasion employs a conditional layout strategy:

-   **`GuestLayout.tsx` (`src/components/GuestLayout.tsx`):**
    -   Used for unauthenticated users (e.g., the landing page).
    -   Provides a minimal, centered layout without the application sidebar.
    -   Encapsulates the `LandingPage` component.

-   **`AppLayout.tsx` (`src/components/AppLayout.tsx`):**
    -   Used for authenticated users (e.g., the main decision interface, history pages).
    -   Includes the `MainSidebar` and a `main` content area that handles its own scrolling.

This separation ensures that unauthenticated users see a clean, marketing-focused page, while authenticated users get the full application experience.

## 3. Component-Based Development

The frontend is built using a modular, component-based approach.

-   **`src/components/`:** Contains all reusable React components.
    -   `MainSidebar.tsx`: The primary navigation sidebar for authenticated users.
    -   `Chat.tsx`: The main chat interface for interacting with the AI.
    -   `Message.tsx`: Renders individual chat messages, including AI questions with clickable `suggestions`.
    -   `DecisionReport.tsx`: Displays the structured AI decision analysis in a visually appealing format.
    -   `LandingPage.tsx`: The marketing-focused welcome page for guests.
    -   `CustomSignInForm.tsx` / `CustomSignUpForm.tsx`: Custom UI for authentication, leveraging Clerk's headless hooks.

## 4. Styling with Tailwind CSS & `shadcn/ui`

-   **Tailwind CSS:** Used for all utility-first styling, enabling rapid and consistent UI development.
-   **`shadcn/ui`:** A collection of re-usable components (e.g., `Button`, `Card`, `DropdownMenu`, `Slider`) that are built on Tailwind CSS and fully customizable. These components are integrated directly into our codebase, allowing for complete control over their appearance and behavior.
-   **Custom Theming:** The application adheres to the "Orcasion" brand identity, featuring a dark theme with purple gradients and neon accents.

## 5. State Management & Data Fetching

-   **Convex React Hooks:** `useQuery`, `useMutation`, and `useConvexAuth` are extensively used for real-time data fetching, database mutations, and managing authentication state from the Convex backend.
-   **React `useState` & `useReducer`:** Used for local component state management.
-   **Next.js `useRouter` & `useParams`:** Used for client-side navigation and accessing dynamic route parameters.

This frontend architecture prioritizes modularity, maintainability, and a responsive, engaging user experience.
