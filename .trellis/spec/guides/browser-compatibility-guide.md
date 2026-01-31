# Browser Compatibility Guide

> **Purpose**: Avoid Node.js-only modules in browser-based projects.

---

## The Problem

Many Node.js modules **cannot run in browsers**. Using them causes cryptic errors like:

```
Uncaught Error: Module "events" has been externalized for browser compatibility.
Cannot access "events.EventEmitter" in client code.
```

---

## Common Node.js Modules to Avoid

### ❌ DON'T Use in Browser Projects

| Module | Use Case | Browser Alternative |
|--------|----------|---------------------|
| `events` | EventEmitter | Framework-specific events (Phaser, React, etc.) |
| `fs` | File system | Fetch API, IndexedDB |
| `path` | Path operations | `URL` API, string manipulation |
| `os` | OS operations | Navigator APIs |
| `crypto` | Cryptography | Web Crypto API |
| `buffer` | Binary data | ArrayBuffer, Uint8Array |
| `stream` | Streams | Web Streams API |
| `process` | Process info | Not applicable in browsers |

---

## Phaser-Specific: Event System

### ❌ DON'T: Node.js EventEmitter

```typescript
import { EventEmitter } from 'events';  // ❌ Won't work in browser

export class DialogueSystem extends EventEmitter {
  public show(): void {
    this.emit('dialogue-start');
  }
}
```

**Error you'll see**:
```
Module "events" has been externalized for browser compatibility.
Cannot access "events.EventEmitter" in client code.
```

### ✅ DO: Use Phaser's EventEmitter

```typescript
import Phaser from 'phaser';

export class DialogueSystem extends Phaser.Events.EventEmitter {
  public show(): void {
    this.emit('dialogue-start');  // ✅ Works in browser
  }
}
```

**Why it works**: Phaser provides its own EventEmitter implementation that's browser-compatible.

---

## How to Detect Browser-Incompatible Modules

### 1. Check Import Errors

If you see this error pattern:
```
Module "xxx" has been externalized for browser compatibility.
```

→ You're using a Node.js-only module.

### 2. Review Your Imports

Search for these patterns:
```bash
# Check for Node.js modules
grep -r "from 'events'" src/
grep -r "from 'fs'" src/
grep -r "from 'path'" src/
grep -r "from 'process'" src/
```

### 3. Use Vite's Compatibility Check

Vite will warn you about Node.js modules during dev:
```
[vite] warning: Package "events" may not be compatible with browser
```

---

## Framework-Specific Event Systems

### React

```typescript
// ❌ DON'T
import { EventEmitter } from 'events';

// ✅ DO - Use built-in events or hooks
const MyApp = () => {
  const [data, setData] = useState();

  // Or use custom event emitter library
  // npm install eventemitter3
  import EventEmitter from 'eventemitter3';
};
```

### Vue

```typescript
// ✅ DO - Use Vue's event system
// Parent component
<template>
  <Child @custom-event="handleEvent" />
</template>

// Or provide/inject for complex cases
```

### Phaser

```typescript
// ✅ DO - Use Phaser.Events.EventEmitter
import Phaser from 'phaser';

export class GameManager extends Phaser.Events.EventEmitter {
  startGame(): void {
    this.emit('game-start');
  }
}
```

### Vanilla JS

```typescript
// ✅ DO - Use EventTarget or custom implementation
// Option 1: Native EventTarget
class MyClass extends EventTarget {
  doSomething(): void {
    this.dispatchEvent(new Event('something'));
  }
}

// Option 2: Use a browser-compatible library
// npm install eventemitter3
import EventEmitter from 'eventemitter3';
```

---

## Common Mistakes

### Mistake 1: Assuming All npm Packages Work in Browser

**Wrong thinking**: "It's in npm, so it must work."

**Reality**: Many npm packages are Node.js-only. Always check:
- Does the package mention "browser" or "universal"?
- Does it have `browser` field in package.json?
- Is it on ESM compatible?

### Mistake 2: Copying Code from Node.js Projects

**Scenario**: You find code examples from a Node.js backend project.

**Problem**: The examples use Node.js modules.

**Solution**: Adapt the pattern to browser equivalents:
```typescript
// Node.js example
import { EventEmitter } from 'events';
import { join } from 'path';

// Browser adaptation
import Phaser from 'phaser';  // Has EventEmitter
const path = `${basePath}/${filename}`;  // String concat
```

### Mistake 3: Not Testing in Browser Early

**Symptom**: Code compiles but crashes in browser.

**Prevention**: Test in browser early and often:
```bash
npm run dev  # Opens browser automatically
```

---

## Vite-Specific Notes

### Why Vite Externalizes Some Modules

Vite marks Node.js modules as "external" because:
1. They can't be bundled for browser
2. It prevents silent failures
3. You get a clear error message

### Checking Module Compatibility

Use `vite-plugin-checker` or similar tools:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  // Vite will warn about Node.js modules
  optimizeDeps: {
    exclude: ['some-node-only-package'],
  },
});
```

---

## Decision Tree

When you need an event system:

```
Need events?
├─ Using Phaser?
│  └─ YES → Use Phaser.Events.EventEmitter
├─ Using React?
│  └─ YES → Use component props/hooks or eventemitter3
├─ Using Vue?
│  └─ YES → Use emit/defineEmits or provide/inject
└─ Vanilla JS?
   └─ Use EventTarget or eventemitter3
```

---

## Checklist

Before importing a module:

- [ ] Is it designed for browsers?
- [ ] Does it work with Vite/Webpack?
- [ ] Are there browser-specific examples?
- [ ] Does package.json have `browser` field?
- [ ] Have I tested it in actual browser?

---

## Quick Reference

### ✅ Safe to Import

```typescript
import Phaser from 'phaser';           // ✅ Browser library
import eventemitter3 from 'eventemitter3';  // ✅ Universal
import { ref } from 'vue';             // ✅ Browser library
import { useState } from 'react';      // ✅ Browser library
```

### ❌ Avoid in Browser

```typescript
import { EventEmitter } from 'events';     // ❌ Node.js only
import { readFileSync } from 'fs';         // ❌ Node.js only
import { join } from 'path';               // ❌ Node.js only
import { platform } from 'os';             // ❌ Node.js only
```

---

## Summary

> **Rule of Thumb**: If you're building for browser, avoid importing anything from Node.js standard library modules (events, fs, path, os, process, etc.). Use framework-specific or browser-compatible alternatives.

**Key Takeaway**: Always verify that third-party packages support browser environments before using them in your frontend/game project.
