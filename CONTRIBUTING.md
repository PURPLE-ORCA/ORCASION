# Contributing to Orcasion

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Orcasion. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## 🛠️ Development Process

1.  **Fork the repository** and clone it locally.
2.  **Install dependencies:** `pnpm install`
3.  **Set up environment variables:** Copy `.env.example` to `.env.local` and fill in your API keys.
4.  **Run the dev server:**
    - `npx convex dev` (Backend)
    - `pnpm dev` (Frontend)
5.  **Create a branch** for your feature or fix: `git checkout -b feature/amazing-feature`
6.  **Commit your changes:** `git commit -m 'Add some amazing feature'`
7.  **Push to the branch:** `git push origin feature/amazing-feature`
8.  **Open a Pull Request**

## 🎨 Code Style

- **Framework:** We use Next.js (App Router) and React.
- **Styling:** We use Tailwind CSS and `shadcn/ui`. Please stick to the existing design system (Black & Purple aesthetic).
- **Formatting:** We use Prettier. Please run `pnpm format` before committing.
- **Linting:** We use ESLint. Please run `pnpm lint` to check for errors.

## 🐛 Reporting Bugs

Bugs are tracked as GitHub issues. When filing an issue, please include:

- A clear title and description.
- Steps to reproduce the bug.
- Expected vs. actual behavior.
- Screenshots or error logs if applicable.

## 💡 Feature Requests

We welcome feature requests! Please open an issue and tag it as `enhancement`. Explain _why_ this feature would be useful and how it fits into the Orcasion vision.

Thank you for helping us build the future of decision-making! 💜
