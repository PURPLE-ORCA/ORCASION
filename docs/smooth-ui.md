# SmoothUI

SmoothUI is a collection of beautifully designed UI components with smooth animations, built with React, Tailwind CSS, and Motion, aiming to enhance user experience through delightful animations and modern design patterns.

## Installation and Setup

### Install Project Dependencies

```bash
# Using pnpm
pnpm install

# Using npm
npm install
```

### Install Smooth UI Dependencies

```bash
pnpm add motion tailwindcss lucide-react clsx tailwind-merge
```

### Install Missing Dependencies

```bash
pnpm add clsx tailwind-merge motion
```

### Clone Smooth UI Repository

```bash
git clone https://github.com/educlopez/smoothui.git
cd smoothui
```

## Development

### Run Development Server

```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev
```

### Start Development Server

```bash
pnpm dev
```

### Build Smooth UI Registry

```bash
pnpm run build:registry
```

## Component Installation

### Configure Smooth UI Registry

Add the SmoothUI registry to your `components.json` file:

```json
{
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
}
```

### Install SmoothUI Component using shadcn CLI

```bash
npx shadcn@latest add @smoothui/siri-orb
```

### Install Multiple SmoothUI Components

```bash
npx shadcn@latest add @smoothui/rich-popover @smoothui/animated-input
```

### Install SmoothUI Component with Dependencies

```bash
npx shadcn@latest add @smoothui/scrollable-card-stack
```

### Install Smooth UI Components

```bash
npx shadcn@latest add @smoothui/siri-orb
```

## CLI Commands

### View all available components

```bash
npx shadcn@latest search @smoothui
```

### View component details before installation

```bash
npx shadcn@latest view @smoothui/siri-orb
```

### Install components

```bash
npx shadcn@latest add @smoothui/component-name
```

## Component Usage

### Basic SiriOrb Usage

```tsx
import { SiriOrb } from "@/components/smoothui/ui/SiriOrb"

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SiriOrb
        size="200px"
        colors={{
          bg: "oklch(95% 0.02 264.695)",
          c1: "oklch(75% 0.15 350)",
          c2: "oklch(80% 0.12 200)",
          c3: "oklch(78% 0.14 280)",
        }}
        animationDuration={20}
      />
    </div>
  )
}
```

### Use SiriOrb Component in React

```tsx
import { SiriOrb } from "@/components/smoothui/ui/SiriOrb"

export default function App() {
  return <SiriOrb size="200px" />
}
```

### Use Multiple SmoothUI Components in React

```tsx
import { RichPopover } from "@/components/smoothui/ui/RichPopover"
import { SiriOrb } from "@/components/smoothui/ui/SiriOrb"

export default function App() {
  return (
    <div>
      <SiriOrb size="200px" />
      <RichPopover />
    </div>
  )
}
```

### Advanced Dashboard Layout

```tsx
import { RichPopover } from "@/components/smoothui/ui/RichPopover"
import { ScrollableCardStack } from "@/components/smoothui/ui/ScrollableCardStack"

export default function Dashboard() {
  const cards = [
    {
      id: "1",
      name: "John Doe",
      handle: "@johndoe",
      avatar: "/avatars/john.jpg",
      video: "/videos/john.mp4",
      href: "https://twitter.com/johndoe",
    },
    // ... more cards
  ]

  return (
    <div className="space-y-8">
      <RichPopover />
      <ScrollableCardStack items={cards} />
    </div>
  )
}
```

## Configuration

### Configure shadcn CLI with SmoothUI Registry

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  },
  "registries": {
    "@smoothui": "https://smoothui.dev/r/{name}.json"
  }
}
```

### Configure TypeScript Path Aliases

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Create cn.ts Utility File

```bash
# Create lib/utils
mkdir -p lib/utils
```

### cn.ts Utility Function

```tsx
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## MCP Server Integration

### Install MCP Server

```bash
# or for Cursor: npx shadcn@latest mcp init --client cursor
# or for VS Code: npx shadcn@latest mcp init --client vscode
npx shadcn@latest mcp init --client claude
```

## Performance Optimization

### Install Sharp for GIF Compression

```bash
npm install sharp
```

### Set Vercel Environment Variables

```bash
# Vercel environment detection
NEXT_PUBLIC_VERCEL_ENV=production
VERCEL_BRANCH_URL=your_branch_url
```

### Configure Vercel Performance Headers

```javascript
// API routes: 5 minutes cache, 10 minutes stale
'/api/(.*)': 'public, s-maxage=300, stale-while-revalidate=600'

// Documentation pages: 1 hour cache, 2 hours stale
'/doc/(.*)': 'public, s-maxage=3600, stale-while-revalidate=7200'

// Static assets: 1 year immutable cache
'/(.*).(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)': 'public, max-age=31536000, immutable'
```

### Monitor GIF Performance in Browser Console

```javascript
// Check browser console for:
// - GIF loading status
// - Performance metrics
// - Memory usage
// - Network conditions
```

### Get Cache Statistics

```typescript
import { getCacheStats } from "@/app/utils/staticDataCache"

const stats = getCacheStats()
console.log("Cache Stats:", stats)
```

### Clear Cache and Get Statistics

```typescript
// Clear all cache
// Check cache stats
import { clearAllCache, getCacheStats } from "@/app/utils/staticDataCache"

clearAllCache()

console.log(getCacheStats())
```

## Development and Contribution

### Create a New Component in SmoothUI

```typescript
const MyNewComponent = () => {
  return <div>Hello, SmoothUI!</div>;
};

export default MyNewComponent;
```

### Commit Changes in SmoothUI

```bash
git add .
git commit -m "Add MyNewComponent"
```

### Push Changes to Remote Repository

```bash
git push origin main
```

## Summary

SmoothUI provides a collection of beautifully animated UI components that integrate seamlessly with the shadcn CLI ecosystem. The library focuses on smooth animations and modern design patterns, built with React, Tailwind CSS, and Motion. Components are installed directly into your project using the shadcn CLI, giving you full control over customization and styling. The library includes components like SiriOrb, RichPopover, and ScrollableCardStack, each designed to enhance user experience through delightful animations and intuitive interactions.