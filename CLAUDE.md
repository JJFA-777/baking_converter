# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- `npm start`: Starts the development server.
- `npm test`: Runs the test suite using Jest.
- `npm run build`: Builds the production-ready application in the `build` directory.

## Architecture Overview

This is a Single Page Application (SPA) built with **React**, focused on a baking ingredient converter tool.

### Theming System
The application uses a robust theming engine based on **CSS Custom Properties** (variables).
- **Implementation**: Themes are defined in `src/App.css` by overriding variables within theme-specific classes (e.g., `.theme-standard`, `.theme-new`, `.theme-dark`) applied to the top-level `.bc-wrap` container.
- **Variables**: Covers colors (gold, champagne, cream, surface, text), backgrounds (gradients), typography (serif, sans, handwriting), and shadows.
- **Persistence**: The active theme is persisted in `localStorage`.

### Component Structure
The application is primarily contained within `src/App.js`, which acts as the orchestrator for state and layout.

- **State Management**: Managed via React `useState` and `useEffect` hooks. Key states include:
  - `theme`: The current active color palette.
  - `tab`: The current view (`convert`, `books`, or `custom`).
  - `selId`: The currently selected ingredient.
  - `custom`: A list of user-defined ingredients.
- **Core Components**:
  - `IngredientPicker`: A searchable, modal-like component for selecting from a large list of ingredients.
  - `EbookCard`: A promotional component for recipe eBooks with WhatsApp integration.
  - `BakingConverter` (Main): The primary component managing the conversion logic and main layout.

### Data & Logic
- **Ingredient Data**: A comprehensive list of ingredients, groups, and their grams-per-cup values is maintained in `INGREDIENT_GROUPS` within `src/App.js`.
- **Conversion Logic**: Math utilities (`toGrams`, `fromGrams`) and a formatting utility (`formatValue`) handle the unit conversions and fraction rendering.
- **Persistence**: Custom ingredients are synchronized with `localStorage` to ensure user data is retained across sessions.
