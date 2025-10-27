# TailwindCSS Icons

TailwindCSS Icons is a Tailwind CSS plugin that allows you to use any icon from Iconify, providing a simple way to integrate a vast library of icons into your projects. It generates utility classes for icons, making them easy to use with Tailwind's utility-first approach.

## Installation

### Install @egoist/tailwindcss-icons

```bash
npm i @egoist/tailwindcss-icons -D
```

### Install Iconify JSON Packages

```bash
# install every icon:
npm i @iconify/json -D

# or install individual packages like this:
npm i @iconify-json/mdi @iconify-json/lucide -D
```

## Configuration

### Usage with JS Config (tailwind.config.js)

```js
const { iconsPlugin, getIconCollections } = require("@egoist/tailwindcss-icons")

module.exports = {
  plugins: [
    iconsPlugin({
      // Select the icon collections you want to use
      // You can also ignore this option to automatically discover all individual icon packages you have installed
      // If you install @iconify/json, you should explicitly specify the collections you want to use, like this:
      collections: getIconCollections(["mdi", "lucide"]),
      // If you want to use all icons from @iconify/json, you can do this:
      // collections: getIconCollections("all"),
      // and the more recommended way is to use `dynamicIconsPlugin`, see below.
    }),
  ],
}
```

### Usage with TailwindCSS v4 CSS Config

```css
@plugin '@egoist/tailwindcss-icons';

/* pass options to the plugin */
@plugin '@egoist/tailwindcss-icons' {
  scale: 1.5;
}
```

### Dynamic Icons Plugin

```js
const { iconsPlugin, dynamicIconsPlugin } = require("@egoist/tailwindcss-icons")

module.exports = {
  plugins: [iconsPlugin(), dynamicIconsPlugin()],
}

// Then you can use icons dynamically like <span class="i-[mdi-light--home]"></span>.
```

### Custom Icons Configuration

```js
module.exports = {
  plugins: [
    iconsPlugin({
      collections: {
        foo: {
          icons: {
            "arrow-left": {
              // svg body
              body: '<path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>',
              // svg width and height, optional
              width: 24,
              height: 24,
            },
          },
        },
      },
    }),
  ],
}
```

## Plugin Options

| Option               | Type                              | Default     | Description                                              |
| -------------------- | --------------------------------- | ----------- | -------------------------------------------------------- |
| prefix               | string                            | `i`         | Class prefix for matching icon rules                     |
| scale                | number                            | `1`         | Scale relative to the current font size                  |
| strokeWidth          | number                            | `undefined` | Stroke width for icons (this may not work for all icons) |
| extraProperties      | Record<string, string>            | `{}`        | Extra CSS properties applied to the generated CSS.       |
| collectionNamesAlias | [key in CollectionNames]?: string | `{}`        | Alias to customize collection names.                     |

## Usage

### Using Icons in HTML

```html
<!-- pattern: i-{collection_name}-{icon_name} -->
<span class="i-mdi-home"></span>
```

### Dynamic Icon Usage

```html
<!-- Use dynamic icons plugin for on-demand icon loading -->
<span class="i-[mdi-light--home]"></span>
<span class="i-[lucide--user]"></span>
```

### Icon with Custom Properties

```html
<!-- Scale icon relative to font size -->
<span class="i-mdi-home text-2xl"></span>

<!-- Apply custom stroke width -->
<span class="i-mdi-home stroke-2"></span>

<!-- Apply extra properties -->
<span class="i-mdi-home custom-class"></span>
```

### Multiple Icons in Components

```html
<!-- Navigation with icons -->
<nav>
  <a href="#" class="i-mdi-home"></a>
  <a href="#" class="i-mdi-account"></a>
  <a href="#" class="i-mdi-cog"></a>
</nav>

<!-- Button with icon -->
<button class="flex items-center gap-2">
  <span class="i-mdi-save"></span>
  Save
</button>
```

## Integration with Different Frameworks

### React Integration

```jsx
import React from 'react'

function IconExample() {
  return (
    <div>
      <span className="i-mdi-home text-2xl" />
      <span className="i-[lucide--user] text-xl" />
    </div>
  )
}
```

### Vue Integration

```vue
<template>
  <div>
    <span class="i-mdi-home text-2xl" />
    <span class="i-[lucide--user] text-xl" />
  </div>
</template>
```

### Next.js Integration

```jsx
import Link from 'next/link'

function Navigation() {
  return (
    <nav className="flex gap-4">
      <Link href="/" className="i-mdi-home text-xl" />
      <Link href="/about" className="i-mdi-information text-xl" />
      <Link href="/contact" className="i-mdi-email text-xl" />
    </nav>
  )
}
```

## Performance Considerations

### Static vs Dynamic Icons

- **Static Icons**: Pre-compiled at build time, better performance for frequently used icons
- **Dynamic Icons**: Loaded on-demand, better for projects with many icons but infrequently used ones

### Optimizing Bundle Size

```js
// Only include specific collections to reduce bundle size
module.exports = {
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["mdi", "lucide", "heroicons"]),
    }),
  ],
}
```

### Using Dynamic Icons for Large Collections

```js
// Use dynamic icons plugin for @iconify/json to avoid large bundle sizes
module.exports = {
  plugins: [
    iconsPlugin(),
    dynamicIconsPlugin(),
  ],
}
```

## Advanced Usage

### Custom Icon Collections

```js
module.exports = {
  plugins: [
    iconsPlugin({
      collections: {
        custom: {
          icons: {
            "logo": {
              body: '<svg>...</svg>',
              width: 32,
              height: 32,
            },
          },
        },
      },
    }),
  ],
}
```

### Icon Aliases

```js
module.exports = {
  plugins: [
    iconsPlugin({
      collectionNamesAlias: {
        mdi: "material-design",
        lucide: "lucide-react",
      },
    }),
  ],
}
```

### Extra CSS Properties

```js
module.exports = {
  plugins: [
    iconsPlugin({
      extraProperties: {
        "display": "inline-block",
        "vertical-align": "middle",
      },
    }),
  ],
}
```

## Troubleshooting

### Common Issues

1. **Icons not showing**: Ensure the icon collection is properly installed and configured
2. **Build errors**: Check that all required dependencies are installed
3. **Wrong icon names**: Verify the icon name follows the pattern `collection-name-icon-name`

### Debug Configuration

```js
module.exports = {
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["mdi", "lucide"]),
      // Enable debug mode
      debug: true,
    }),
  ],
}
```

## Summary

TailwindCSS Icons provides a powerful and flexible way to integrate Iconify's vast icon library into Tailwind CSS projects. The plugin generates utility classes for icons, making them easy to use with Tailwind's utility-first approach. It supports both static and dynamic icon loading, custom icon collections, and extensive configuration options. The plugin is designed to be lightweight and performant, with options to optimize bundle size based on project needs.