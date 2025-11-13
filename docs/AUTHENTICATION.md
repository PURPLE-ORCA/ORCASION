# 🔐 Authentication Documentation

This document explains Orcasion's custom authentication system, which is built using Clerk but replaces its default UI components with a fully branded experience.

## 1. Core Strategy: Headless Hooks

Instead of using Clerk's pre-built `<SignIn>`, `<SignUp>`, and `<UserButton>` components, we use Clerk's **headless hooks** to manage the authentication logic. This gives us complete control over the UI, allowing for a seamless and branded user experience.

The key hooks used are:
-   `useUser()`: Provides access to the currently signed-in user's data (e.g., name, profile image).
-   `useClerk()`: Provides access to core Clerk functions like `signOut()` and `openUserProfile()`.
-   `useSignUp()`: Provides the methods needed to build a custom registration flow (`signUp.create()`, `signUp.attemptEmailAddressVerification()`).
-   `useSignIn()`: Provides the methods needed to build a custom sign-in flow (`signIn.create()`).

## 2. Custom Component Implementation

### `AccountMenu.tsx`

-   **Purpose:** Replaces the default `<UserButton>`.
-   **Logic:**
    1.  It uses the `useUser()` hook to get the user's `imageUrl` and `fullName`.
    2.  It uses the `useClerk()` hook to bind the `signOut()` and `openUserProfile()` methods to the dropdown menu options.
    3.  The UI is built with `shadcn/ui`'s `DropdownMenu` component.
-   **Configuration:** To render the user's avatar, Clerk's image domain (`img.clerk.com`) was whitelisted in `next.config.ts`.

### `CustomSignUpForm.tsx` & `CustomSignInForm.tsx`

-   **Purpose:** Replace the default `<SignUp>` and `<SignIn>` pages.
-   **Logic:**
    1.  These components use standard React `useState` to manage the form inputs.
    2.  They call the methods provided by the `useSignUp()` and `useSignIn()` hooks to handle the actual authentication logic.
    3.  This includes handling multi-step processes like email verification.
-   **UI:** The forms are built using our custom `MagicCard` and `shadcn/ui` components to match the application's aesthetic.

## 3. The Clerk-Convex Bridge

Authentication is a two-part process: authenticating the user on the frontend (Clerk) and authenticating their requests to the backend (Convex). This is achieved through a "bridge" configuration.

1.  **`ConvexProviderWithClerk`:** In `ConvexClientProvider.tsx`, we wrap our application with this special provider. It automatically acquires the JWT (authentication token) from Clerk and attaches it to every request sent to the Convex backend.

2.  **`convex/auth.config.ts`:** This file on the backend tells Convex to trust Clerk as a valid authentication provider. It configures the `issuer` URL and `applicationID` from the Clerk dashboard.

3.  **Clerk JWT Template:** Within the Clerk dashboard, a "Convex" JWT template must be configured. This ensures that the tokens Clerk generates are in a format that Convex can understand and verify.

This setup provides a secure and seamless authentication experience from the user's first click in our custom UI to their first authenticated request to our database.
