# Frontend Development Guidelines

> Best practices for frontend development in this project.

---

## Overview

This directory contains guidelines for frontend development in this project.

---

## Guidelines Index

| Guide | Description | Status |
|-------|-------------|--------|
| [Phaser 3 Game Development](./phaser-guidelines.md) | Phaser 3 game dev patterns, scene organization, best practices | ✅ Complete |
| [Directory Structure](./directory-structure.md) | Module organization and file layout | To fill |
| [Component Guidelines](./component-guidelines.md) | Component patterns, props, composition | To fill |
| [Hook Guidelines](./hook-guidelines.md) | Custom hooks, data fetching patterns | To fill |
| [State Management](./state-management.md) | Local state, global state, server state | To fill |
| [Quality Guidelines](./quality-guidelines.md) | Code standards, forbidden patterns | To fill |
| [Type Safety](./type-safety.md) | Type patterns, validation | To fill |

---

## How to Use These Guidelines

For each guideline file:

1. Document your project's **actual conventions** (not ideals)
2. Include **code examples** from your codebase
3. List **forbidden patterns** and why
4. Add **common mistakes** your team has made

The goal is to help AI assistants and new team members understand how YOUR project works.

---

## Project-Specific Notes

### Game Development (Phaser 3)

This project uses **Phaser 3** for game development. Key conventions:

- Scene organization: Separate scenes for Boot, Title, Map, Battle
- Game objects: Extend `Phaser.GameObjects.Container`
- Events: Use `Phaser.Events.EventEmitter` (NOT Node.js `events`)
- Physics: Arcade physics with proper body setup
- Type safety: Strict TypeScript with custom game data types

**See**: [Phaser 3 Game Development Guidelines](./phaser-guidelines.md) for detailed patterns and common mistakes.

---

**Language**: All documentation should be written in **English**.
