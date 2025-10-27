# Clerk Documentation System

The Clerk Documentation System is a sophisticated build pipeline for generating multi-SDK documentation websites from MDX source files. It transforms markdown content into SDK-specific variants, manages navigation manifests, validates links and cross-references, and produces optimized static documentation ready for deployment. The system handles complex requirements like SDK-scoping, embedded partials, TypeDoc integration, and redirect management.

This documentation system is designed for projects that need to maintain a single source of truth while generating framework-specific documentation variants. It validates content structure, embeds reusable components, filters SDK-specific content using conditional logic, and produces a complete static site with optimized redirects and search metadata. The build process ensures all internal links are valid, headings are unique, and SDK-specific content is properly scoped across 24+ supported frameworks including Next.js, React, Vue, Expo, and backend frameworks.

## Build System

### Build Documentation Pipeline

Compiles all MDX documentation files with SDK-specific variants, validates links and structure, embeds partials and TypeDoc content, generates navigation manifest, and outputs static files to the distribution directory.

```bash
# Basic build
npm run build

# Development mode with file watching
npm run dev

# Watch mode with hot reload
bun --watch ./scripts/build-docs.ts --watch
```

```typescript
import { build, createConfig, createBlankStore } from './scripts/build-docs'

// Programmatic build
const config = await createConfig({
  basePath: __dirname,
  dataPath: '../data',
  docsPath: '../docs',
  baseDocsLink: '/docs/',
  manifestPath: '../docs/manifest.json',
  partialsPath: '../docs/_partials',
  distPath: '../dist',
  validSdks: ['nextjs', 'react', 'vue', 'expo'],
  manifestOptions: {
    wrapDefault: true,
    hideTitleDefault: false,
  },
  flags: {
    watch: false,
    controlled: false,
  }
})

const store = createBlankStore()
const warnings = await build(config, store)

if (warnings) {
  console.log(warnings)
}

// Expected output:
// ✓ Read, optimized and transformed redirects
// ✓ Read Manifest
// ✓ Read Docs Folder
// ✓ Loaded in 42 partials (0 cached)
// ✓ Loaded in 150 docs (0 cached)
// ✓ Applied manifest sdk scoping
// ✓ Validated all core docs (0 cached)
// ✓ Wrote out all core docs (150 total)
// ✓ Wrote out 50 nextjs specific docs
```

### Type Checking

Validates TypeScript types across the entire project without emitting compiled files.

```bash
npm run typecheck

# Expected output:
# No errors found
```

## Manifest Management

### Reading and Validating Manifest

Parses the navigation manifest JSON file, validates its structure against the schema, and returns a typed manifest object with validation file for error reporting.

```typescript
import { readManifest } from './scripts/lib/manifest'
import { createConfig } from './scripts/lib/config'

const config = await createConfig({
  basePath: __dirname,
  manifestPath: '../docs/manifest.json',
  validSdks: ['nextjs', 'react', 'vue'],
  // ... other config
})

const getManifest = readManifest(config)
const { manifest, vfile } = await getManifest()

// manifest structure:
// [
//   [
//     {
//       title: "Getting Started",
//       items: [[{ title: "Quickstart", href: "/docs/quickstart", sdk: ["nextjs"] }]]
//     }
//   ]
// ]
```

### Traversing Manifest Tree

Recursively processes manifest items and groups, applying transformations while preserving the nested structure.

```typescript
import { traverseTree } from './scripts/lib/manifest'

const transformedManifest = await traverseTree(
  { items: manifest },
  // Transform individual items
  async (item, tree) => {
    return {
      ...item,
      href: item.href.replace('/docs/', '/documentation/'),
    }
  },
  // Transform groups
  async (group, tree) => {
    return {
      ...group,
      title: group.title.toUpperCase(),
    }
  },
  // Handle errors
  (item, error) => {
    console.error('Error processing:', item.title, error)
  }
)
```

### Flattening Manifest Tree

Extracts all items with hrefs from a nested manifest structure into a flat array.

```typescript
import { flattenTree } from './scripts/lib/manifest'

const flatManifest = flattenTree(manifest)
// Returns: [
//   { title: "Quickstart", href: "/docs/quickstart", sdk: ["nextjs"] },
//   { title: "Core Concepts", href: "/docs/core-concepts" },
//   // ... all other items
// ]
```

## SDK Management

### SDK Definitions

Defines all supported SDK identifiers used for documentation scoping and filtering.

```typescript
import { VALID_SDKS, SDK, isValidSdk } from './scripts/lib/schemas'

// All supported SDKs
const sdks = VALID_SDKS
// ['nextjs', 'react', 'js-frontend', 'chrome-extension', 'expo',
//  'android', 'ios', 'expressjs', 'fastify', 'react-router',
//  'remix', 'tanstack-react-start', 'go', 'astro', 'nuxt',
//  'vue', 'ruby', 'js-backend']

// Type-safe SDK checking
const config = await createConfig({ validSdks: VALID_SDKS, /* ... */ })
const isSdk = isValidSdk(config)

if (isSdk('nextjs')) {
  // TypeScript knows this is a valid SDK
  const sdk: SDK = 'nextjs'
}
```

### Filtering SDK Content

Removes content from markdown AST that doesn't match the target SDK, processing `<If sdk="...">` components and their children.

```typescript
import { remark } from 'remark'
import remarkMdx from 'remark-mdx'
import { filterOtherSDKsContentOut } from './scripts/lib/plugins/filterOtherSDKsContentOut'

const processor = remark()
  .use(remarkMdx)
  .use(filterOtherSDKsContentOut(config, '/docs/guide.mdx', 'nextjs'))

// Input MDX:
// <If sdk="nextjs">Next.js specific content</If>
// <If sdk="react">React specific content</If>
// Common content for all SDKs

// Output for 'nextjs':
// Next.js specific content
// Common content for all SDKs

const result = await processor.process(mdxContent)
```

## Link Validation

### Validating Documentation Links

Ensures all internal links point to existing documentation pages and validates hash fragments point to actual headings.

```typescript
import { validateLinks } from './scripts/lib/plugins/validateLinks'
import { remark } from 'remark'
import remarkMdx from 'remark-mdx'

const docsMap = new Map([
  ['/docs/quickstart', { /* doc data */ }],
  ['/docs/core-concepts', { /* doc data */ }],
])

const foundLinks = new Set()

const processor = remark()
  .use(remarkMdx)
  .use(
    validateLinks(
      config,
      docsMap,
      '/docs/guide.mdx',
      'docs',
      (link) => foundLinks.add(link),
      '/docs/guide'
    )
  )

// Validates:
// [Valid link](/docs/quickstart) ✓
// [Broken link](/docs/nonexistent) ✗ Error
// [Hash link](/docs/quickstart#install) ✓ (if heading exists)
// [Bad hash](/docs/quickstart#missing) ✗ Warning

await processor.process(mdxContent)
```

### Embedding SDK-Scoped Links

Transforms regular markdown links into SDK-aware `<SDKLink>` components for SDK-specific routing.

```typescript
import { embedLinks } from './scripts/lib/plugins/embedLinks'
import { remark } from 'remark'
import remarkMdx from 'remark-mdx'

const processor = remark()
  .use(remarkMdx)
  .use(
    embedLinks(
      config,
      docsMap,
      ['nextjs', 'react'], // available SDKs
      (link) => console.log('Found link:', link),
      '/docs/current-page',
      'nextjs' // target SDK
    )
  )

// Input:
// [Guide](/docs/authentication)

// Output when doc supports multiple SDKs:
// <SDKLink href="/docs/:sdk:/authentication">Guide</SDKLink>

// Output when doc is core (no SDK scoping):
// [Guide](/docs/authentication)

await processor.process(mdxContent)
```

## Partials and Embeds

### Checking and Embedding Partials

Validates partial references and embeds their content inline, replacing `<Partial>` components with actual markdown content.

```typescript
import { checkPartials } from './scripts/lib/plugins/checkPartials'
import { readPartialsFolder, readPartialsMarkdown } from './scripts/lib/partials'
import { remark } from 'remark'
import remarkMdx from 'remark-mdx'

// Load partials
const partialsFiles = await readPartialsFolder(config)
const partials = await readPartialsMarkdown(config, store)(
  partialsFiles.map(f => f.path)
)

const foundPartials = new Set()

const processor = remark()
  .use(remarkMdx)
  .use(
    checkPartials(
      config,
      partials,
      { filePath: '/docs/guide.mdx', href: '/docs/guide' },
      { reportWarnings: true, embed: true },
      (partial) => foundPartials.add(partial)
    )
  )

// Input MDX:
// <Partial file="authentication/setup.mdx" />

// Output (embedded):
// ## Authentication Setup
// Configure your auth provider...
// [actual partial content]

await processor.process(mdxContent)
```

### Checking and Embedding TypeDoc

Validates TypeDoc references and embeds API documentation content inline, handling special characters in tables.

```typescript
import { checkTypedoc } from './scripts/lib/plugins/checkTypedoc'
import { readTypedocsFolder, readTypedocsMarkdown } from './scripts/lib/typedoc'

const typedocsFiles = await readTypedocsFolder(config)
const typedocs = await readTypedocsMarkdown(config, store)(
  typedocsFiles.map(f => f.path)
)

const processor = remark()
  .use(remarkMdx)
  .use(
    checkTypedoc(
      config,
      typedocs,
      '/docs/api-reference.mdx',
      { reportWarnings: true, embed: true },
      (typedoc) => console.log('Embedded:', typedoc)
    )
  )

// Input:
// <Typedoc file="clerk-js.User.mdx" />

// Output (embedded with formatted tables):
// | Property | Type | Description |
// | --- | --- | --- |
// | id | string | User's unique identifier |
// | email | string | Primary email address |

await processor.process(mdxContent)
```

## Frontmatter Management

### Extracting Frontmatter

Parses YAML frontmatter from MDX files and validates against schema.

```typescript
import { remark } from 'remark'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdx from 'remark-mdx'
import yaml from 'yaml'

const processor = remark()
  .use(remarkFrontmatter)
  .use(remarkMdx)
  .use(() => (tree, file) => {
    const frontmatterNode = tree.children.find(
      node => node.type === 'yaml'
    )
    if (frontmatterNode && 'value' in frontmatterNode) {
      const frontmatter = yaml.parse(frontmatterNode.value)
      file.data.frontmatter = frontmatter
    }
  })

// Input MDX:
// ---
// title: Authentication Guide
// description: Learn how to add authentication
// sdk: nextjs
// ---
// # Content here

const result = await processor.process(mdxContent)
const frontmatter = result.data.frontmatter
// { title: "Authentication Guide", description: "...", sdk: "nextjs" }
```

### Inserting Frontmatter

Dynamically adds or updates frontmatter fields with computed values like last updated date, SDK scoping, and canonical URLs.

```typescript
import { insertFrontmatter } from './scripts/lib/plugins/insertFrontmatter'
import { remark } from 'remark'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdx from 'remark-mdx'

const processor = remark()
  .use(remarkFrontmatter)
  .use(remarkMdx)
  .use(
    insertFrontmatter({
      lastUpdated: new Date('2025-01-15').toISOString(),
      sdkScoped: 'true',
      canonical: '/docs/nextjs/guide',
      sdk: 'nextjs',
      availableSdks: 'nextjs,react,vue',
      activeSdk: 'nextjs'
    })
  )

// Original frontmatter:
// ---
// title: Guide
// ---

// Updated frontmatter:
// ---
// title: Guide
// lastUpdated: 2025-01-15T00:00:00.000Z
// sdkScoped: true
// canonical: /docs/nextjs/guide
// sdk: nextjs
// availableSdks: nextjs,react,vue
// activeSdk: nextjs
// ---

await processor.process(mdxContent)
```

## Validation Plugins

### Validating If Components

Ensures `<If>` conditional components reference valid SDKs and are compatible with document SDK scoping.

```typescript
import { validateIfComponents } from './scripts/lib/plugins/validateIfComponents'
import { remark } from 'remark'
import remarkMdx from 'remark-mdx'

const doc = {
  sdk: ['nextjs', 'react'],
  frontmatter: { sdk: ['nextjs', 'react'] },
  // ... other doc properties
}

const processor = remark()
  .use(remarkMdx)
  .use(validateIfComponents(config, '/docs/guide.mdx', doc, flatManifest))

// Valid:
// <If sdk="nextjs">Next.js content</If>

// Invalid (SDK not in doc.sdk):
// <If sdk="vue">Vue content</If>  // ✗ Error

// Invalid (SDK doesn't exist):
// <If sdk="invalid">Content</If>  // ✗ Error

await processor.process(mdxContent)
```

### Validating Unique Headings

Ensures all headings within a document have unique identifiers to prevent hash collision.

```typescript
import { validateUniqueHeadings } from './scripts/lib/plugins/validateUniqueHeadings'
import { remark } from 'remark'
import remarkMdx from 'remark-mdx'

const processor = remark()
  .use(remarkMdx)
  .use(validateUniqueHeadings(config, '/docs/guide.mdx', 'docs'))

// Input MDX with duplicate headings:
// ## Installation
// Content here
// ## Installation  // ✗ Error: Duplicate heading

// Valid:
// ## Installation
// ### Installation for React  // ✓ Different level/text
// ## Configuration  // ✓ Different text

await processor.process(mdxContent)
```

## Redirect Management

### Reading Redirects

Loads static and dynamic redirect configurations from JSON/JSONC files.

```typescript
import { readRedirects } from './scripts/lib/redirects'

const config = await createConfig({
  redirects: {
    static: {
      inputPath: '../redirects/static/docs.json',
      outputPath: '_redirects/static.json',
    },
    dynamic: {
      inputPath: '../redirects/dynamic/docs.jsonc',
      outputPath: '_redirects/dynamic.jsonc',
    }
  },
  // ... other config
})

const { staticRedirects, dynamicRedirects } = await readRedirects(config)

// staticRedirects: [
//   { source: "/old-path", destination: "/new-path", permanent: true }
// ]

// dynamicRedirects: [
//   { source: "/docs/:sdk/guide", destination: "/docs/:sdk/guides", permanent: false }
// ]
```

### Optimizing Redirect Chains

Analyzes redirect chains and flattens them to point directly to final destinations.

```typescript
import { analyzeAndFixRedirects } from './scripts/lib/redirects'

const redirects = [
  { source: '/a', destination: '/b', permanent: true },
  { source: '/b', destination: '/c', permanent: true },
  { source: '/c', destination: '/d', permanent: true },
]

const optimized = analyzeAndFixRedirects(redirects)

// Before:
// /a -> /b -> /c -> /d (3 hops)

// After:
// /a -> /d (direct)
// /b -> /d (direct)
// /c -> /d (direct)

// optimized: [
//   { source: '/a', destination: '/d', permanent: true },
//   { source: '/b', destination: '/d', permanent: true },
//   { source: '/c', destination: '/d', permanent: true },
// ]
```

### Writing Redirects

Writes optimized redirects to the output directory for production deployment.

```typescript
import {
  readRedirects,
  analyzeAndFixRedirects,
  transformRedirectsToObject,
  writeRedirects
} from './scripts/lib/redirects'

const { staticRedirects, dynamicRedirects } = await readRedirects(config)

const optimizedStatic = analyzeAndFixRedirects(staticRedirects)
const staticObject = transformRedirectsToObject(optimizedStatic)

await writeRedirects(config, staticObject, dynamicRedirects)

// Creates:
// dist/_redirects/static.json
// dist/_redirects/dynamic.jsonc

console.log('✓ Wrote redirects to disk')
```

## Utility Scripts

### Checking Quickstarts

Validates that all quickstart files follow naming conventions and match manifest entries.

```bash
npm run lint:check-quickstarts

# Verifies:
# - quickstart.{sdk}.mdx files exist for all SDKs
# - No orphaned quickstart files
# - Quickstart entries in manifest are valid
```

### Checking Frontmatter

Validates frontmatter fields across all MDX files, ensuring required fields exist and SDK declarations are valid.

```bash
npm run lint:check-frontmatter

# Validates:
# - title field is present (required)
# - description field exists (warns if missing)
# - sdk field contains valid SDK identifiers
# - No unknown frontmatter fields
```

### Checking Redirects

Analyzes redirect chains, detects circular redirects, and validates destination paths exist.

```bash
npm run lint:check-redirects

# Checks:
# - No circular redirect chains
# - Destinations point to valid pages
# - No unnecessary multi-hop redirects
# - Redirect syntax is valid
```

### Tracing Redirects

Shows the full redirect path from a source URL to its final destination.

```bash
npm run trace-redirect /old-docs-path

# Output:
# /old-docs-path
#   -> /docs-v2
#   -> /docs/getting-started
#   -> /docs/quickstart (final)
```

## Linting and Formatting

### Format All Files

Formats all markdown, code, and configuration files using Prettier.

```bash
npm run format

# Formats:
# - *.md, *.mdx files
# - *.ts, *.tsx, *.js files
# - *.json, *.jsonc files
# - Configuration files
```

### Check Formatting

Verifies all files are formatted correctly without making changes.

```bash
npm run lint:formatting

# Exit code 0: All files formatted correctly
# Exit code 1: Some files need formatting (run npm run format)
```

### Run All Linting

Executes all lint checks concurrently for full validation.

```bash
npm run lint

# Runs concurrently:
# - npm run lint:formatting
# - npm run lint:check-quickstarts
# - npm run lint:check-frontmatter
# - npm run lint:check-redirects
# - npm run lint:check-duplicate-redirects
```

## Summary

The Clerk Documentation System provides a comprehensive solution for building SDK-scoped documentation from a single source. The main use cases include generating framework-specific documentation variants (Next.js, React, Vue, etc.) from shared MDX files, validating all cross-references and links across documentation, embedding reusable content through partials and TypeDoc, and managing complex redirect chains for URL migrations. The build system ensures documentation integrity through extensive validation while maintaining flexibility for multi-framework support.

Integration is straightforward: define your documentation structure in MDX files with optional SDK frontmatter, organize navigation in manifest.json with SDK scoping, run the build command to generate static output, and deploy the dist directory. The system handles SDK filtering through `<If>` components, generates SDK-specific routes automatically, validates all links and references at build time, and produces optimized redirects for seamless URL transitions. This architecture scales to support dozens of frameworks while maintaining a single authoritative content source.