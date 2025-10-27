# shadcn/ui

shadcn/ui is a collection of accessible and customizable UI components built with React, Radix UI, and Tailwind CSS. Unlike traditional component libraries, shadcn/ui provides a CLI tool that copies component source code directly into your project, giving you full ownership and customization control. The components are not installed as dependencies but rather integrated into your codebase where you can modify them freely.

The project is structured as a monorepo containing the shadcn CLI package, documentation website, component registry, and example implementations. The CLI (`npx shadcn`) handles project initialization, component installation, dependency management, and configuration updates. Components are stored in a registry system organized by style variants (default, new-york) and fetched dynamically during installation. The system supports custom registries, allowing teams to create and maintain their own component collections with private or public access.

## CLI Commands

### Initialize a new project

```bash
# Initialize with interactive prompts
npx shadcn init

# Initialize with defaults (Next.js, TypeScript, neutral base color)
npx shadcn init --defaults

# Initialize with specific configuration
npx shadcn init --base-color slate --no-css-variables --template next

# Initialize and add components in one command
npx shadcn init button card dialog
```

### Add components to your project

```bash
# Add a single component
npx shadcn add button

# Add multiple components
npx shadcn add button card dialog

# Add all available components
npx shadcn add --all

# Add component with overwrite
npx shadcn add button --overwrite

# Add component from URL or registry
npx shadcn add https://example.com/button.json
npx shadcn add @acme/button

# Skip confirmation prompts
npx shadcn add button --yes
```

### Check for component updates

```bash
# Check all components for updates
npx shadcn diff

# Check specific component for updates
npx shadcn diff button

# Example output when updates are found:
# The following components have updates available:
# - button
#   - components/ui/button.tsx
# Run diff <component> to see the changes.
```

### Search for components

```bash
# Search components interactively
npx shadcn search

# Search for specific term
npx shadcn search dialog

# Example: Search returns component names, descriptions, and categories
# Results are fuzzy-matched and ranked by relevance
```

### View component information

```bash
# View component details
npx shadcn view button

# Example output includes:
# - Component name and description
# - Dependencies (npm packages)
# - Registry dependencies (other shadcn components)
# - Files that will be installed
# - Tailwind configuration requirements
```

### Project information

```bash
# Display project configuration
npx shadcn info

# Example output:
# Project: my-app
# Framework: Next.js
# Style: new-york
# TypeScript: Yes
# Tailwind CSS: 3.4.6
# CSS Variables: Yes
```

### Run migrations

```bash
# List available migrations
npx shadcn migrate --list

# Run icon library migration
npx shadcn migrate icons

# Run Radix UI migration
npx shadcn migrate radix

# Skip confirmation prompt
npx shadcn migrate icons --yes

# Available migrations:
# - icons: Migrate your UI components to a different icon library
# - radix: Migrate to radix-ui
```

### Build registry

```bash
# Build components for a shadcn registry
npx shadcn build

# Build with custom registry file
npx shadcn build ./my-registry.json

# Specify output directory
npx shadcn build --output ./dist/r

# Example: Build registry from registry.json to public/r
npx shadcn build ./registry.json --output ./public/r
```

## Registry API

### Fetch registry items programmatically

```typescript
import { getRegistryItems } from "shadcn/registry"

// Fetch single component
const [button] = await getRegistryItems(["button"], {
  config: {
    style: "new-york",
    tailwind: {
      config: "tailwind.config.js",
      css: "app/globals.css",
      baseColor: "slate",
      cssVariables: true,
    },
  },
})

// Access component metadata
console.log(button.name) // "button"
console.log(button.type) // "registry:ui"
console.log(button.dependencies) // ["@radix-ui/react-slot"]
console.log(button.files) // [{ path: "button.tsx", content: "...", type: "registry:ui" }]

// Fetch multiple components
const items = await getRegistryItems(["button", "card", "dialog"])
items.forEach((item) => {
  console.log(`${item.name}: ${item.files?.length} files`)
})
```

### Resolve component dependency tree

```typescript
import { resolveRegistryItems } from "shadcn/registry"

// Resolve all dependencies for a component
const tree = await resolveRegistryItems(["dialog"], {
  config: {
    style: "new-york",
  },
})

// tree contains the dialog component plus all its dependencies
// For example, dialog might depend on button, which is automatically included
console.log(tree.files) // All files needed for dialog and its dependencies
console.log(tree.dependencies) // ["@radix-ui/react-dialog", "@radix-ui/react-slot"]
console.log(tree.registryDependencies) // ["button"]
```

### Fetch registry configuration

```typescript
import { getRegistry, getRegistriesConfig, getRegistriesIndex } from "shadcn/registry"

// Fetch registry metadata
const registry = await getRegistry("@shadcn/ui")

console.log(registry.name) // "@shadcn/ui"
console.log(registry.homepage) // "https://ui.shadcn.com"
console.log(registry.items.length) // Number of available components

// Access built-in and custom registries from local config
const config = await getRegistriesConfig(process.cwd())
console.log(config.registries) // { "@shadcn": {...}, "@acme": {...} }

// Fetch global registries index from shadcn registry
const registriesIndex = await getRegistriesIndex()
registriesIndex.forEach((registry) => {
  console.log(`${registry.name} - ${registry.description}`)
  console.log(`URL: ${registry.url}`)
})
```

### Fetch registry index and styles

```typescript
import {
  getShadcnRegistryIndex,
  getRegistryStyles,
  getRegistryBaseColors,
  getRegistryIcons,
} from "shadcn/registry"

// Get all available components
const index = await getShadcnRegistryIndex()
index.forEach((item) => {
  console.log(`${item.name} - ${item.description}`)
})

// Get available styles
const styles = await getRegistryStyles()
// Returns: [{ name: "default", label: "Default" }, { name: "new-york", label: "New York" }]

// Get available base colors
const colors = await getRegistryBaseColors()
// Returns: [{ name: "slate", label: "Slate" }, { name: "gray", label: "Gray" }, ...]

// Get available icon libraries
const icons = await getRegistryIcons()
// Returns icon library configurations for lucide-react, radix-icons, etc.
```

### Search registries programmatically

```typescript
import { searchRegistries } from "shadcn/registry"

// Search for components across registries
const results = await searchRegistries({
  query: "dialog",
  registries: ["@shadcn/ui"],
})

results.forEach((result) => {
  console.log(`${result.name} - ${result.description}`)
  console.log(`Registry: ${result.registry}`)
  console.log(`Type: ${result.type}`)
})

// Search returns fuzzy-matched results ranked by relevance
// Useful for building search interfaces or CLI tools
```

## Component Schema

### Registry item structure

```typescript
import { z } from "zod"
import { registryItemSchema } from "shadcn/schema"

// Define a custom component for your registry
const myComponent: z.infer<typeof registryItemSchema> = {
  name: "my-button",
  type: "registry:ui",
  description: "A customized button component",
  dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
  registryDependencies: ["utils"],
  files: [
    {
      path: "my-button.tsx",
      type: "registry:ui",
      content: `
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`,
    },
  ],
  tailwind: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: "hsl(var(--primary))",
            "primary-foreground": "hsl(var(--primary-foreground))",
          },
        },
      },
    },
  },
  cssVars: {
    light: {
      primary: "222.2 47.4% 11.2%",
      "primary-foreground": "210 40% 98%",
    },
    dark: {
      primary: "210 40% 98%",
      "primary-foreground": "222.2 47.4% 11.2%",
    },
  },
}

// Validate against schema
registryItemSchema.parse(myComponent)
```

### Custom registry configuration

```typescript
import { promises as fs } from "fs"
import { z } from "zod"

// Define custom registry in components.json
const componentsConfig = {
  $schema: "https://ui.shadcn.com/schema.json",
  style: "new-york",
  rsc: true,
  tsx: true,
  tailwind: {
    config: "tailwind.config.ts",
    css: "app/globals.css",
    baseColor: "slate",
    cssVariables: true,
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
    lib: "@/lib",
    hooks: "@/hooks",
  },
  registries: {
    "@acme": {
      url: "https://registry.acme.com/{name}.json",
      headers: {
        Authorization: "Bearer ${ACME_TOKEN}",
      },
    },
    "@private": "https://internal.company.com/components/{name}.json",
  },
}

// Write configuration
await fs.writeFile(
  "components.json",
  JSON.stringify(componentsConfig, null, 2)
)

// Now you can install from custom registries:
// npx shadcn add @acme/custom-button
// npx shadcn add @private/internal-component
```

## MCP Server Integration

### Initialize MCP server for AI assistants

```bash
# Initialize MCP server for Claude Code
npx shadcn mcp init --client claude

# Initialize for Cursor
npx shadcn mcp init --client cursor

# Initialize for VS Code
npx shadcn mcp init --client vscode

# This creates configuration files:
# Claude: .mcp.json
# Cursor: .cursor/mcp.json
# VS Code: .vscode/mcp.json

# Example .mcp.json content:
# {
#   "mcpServers": {
#     "shadcn": {
#       "command": "npx",
#       "args": ["shadcn@latest", "mcp"]
#     }
#   }
# }
```

### Run MCP server

```bash
# Start MCP server (used internally by AI assistants)
npx shadcn mcp

# The server provides tools for AI assistants to:
# - List available components
# - Search components
# - Get component details
# - Install components
# - Update components
```

## Programmatic Usage

### Initialize project programmatically

```typescript
import { runInit } from "shadcn"

// Initialize a new project
const config = await runInit({
  cwd: "/path/to/project",
  yes: true,
  defaults: false,
  force: false,
  silent: false,
  isNewProject: true,
  srcDir: true,
  cssVariables: true,
  baseStyle: true,
  baseColor: "slate",
  components: ["button", "card"],
})

console.log("Project initialized with config:")
console.log(config.style) // "new-york"
console.log(config.resolvedPaths.components) // "/path/to/project/src/components"
```

### Add components programmatically

```typescript
import { addComponents } from "shadcn"
import { getConfig } from "shadcn"

// Load existing configuration
const config = await getConfig(process.cwd())

// Add components
await addComponents(["button", "card", "dialog"], config, {
  overwrite: false,
  silent: false,
  isNewProject: false,
})

// Components are now installed in your project with:
// - Component files in components/ui/
// - Dependencies added to package.json
// - Tailwind config updated
// - CSS variables added
```

### Validate configuration

```typescript
import { rawConfigSchema } from "shadcn/schema"
import { promises as fs } from "fs"

// Read and validate components.json
const configFile = await fs.readFile("components.json", "utf8")
const config = JSON.parse(configFile)

try {
  const validated = rawConfigSchema.parse(config)
  console.log("Configuration is valid")
} catch (error) {
  console.error("Invalid configuration:", error.errors)
}
```

## Integration and Extension

shadcn/ui is designed for deep integration into your development workflow. The CLI can be used directly in terminal sessions, integrated into npm scripts for automation, or embedded in custom build tools. All components are installed as source code, allowing teams to modify styling, behavior, and structure without worrying about breaking upstream updates. The diff command helps track changes between your customized components and registry updates.

The registry system supports both public and private registries with authentication via environment variables or headers. Teams can fork the registry structure to create company-specific component libraries while maintaining compatibility with the shadcn CLI. The MCP server integration enables AI assistants to discover, install, and update components autonomously during development sessions. Component schemas are fully typed with Zod, enabling type-safe programmatic access and validation of registry items, making it suitable for building custom tooling around the shadcn ecosystem.