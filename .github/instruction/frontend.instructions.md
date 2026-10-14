---
applyTo: "**/*.{ts,tsx}"
---

# Frontend Instructions

## General

- Prefer simple, readable implementations.
- Prefer existing project patterns.
- Avoid premature abstractions.
- Do not create abstractions without a concrete use case.
- Do not modify unrelated code.

## React

- Prefer functional components.
- Prefer composition over inheritance.
- Keep components focused on a meaningful responsibility.
- Avoid putting substantial orchestration or business logic directly into JSX.
- Separate non-trivial data loading and orchestration when doing so improves readability or testability.
- Do not create components merely to shorten a file or hide a long `className`.
- Do not create hooks merely to move a few lines of code.

## TypeScript

- Avoid `any` unless there is a concrete justification.
- Avoid unnecessary type assertions.
- Prefer explicit domain types at public boundaries.
- Reuse existing domain contracts instead of duplicating them.
- Avoid complex generic abstractions without a concrete benefit.

## Functions

- Keep functions focused.
- Extract pure functions when they improve readability or testability.
- Do not split simple logic into many tiny functions only for the sake of abstraction.

## State

Distinguish between:

- server state;
- local UI state;
- derived state;
- host state;
- plugin state.

Use the state-management tool appropriate to the ownership of the state.

Do not duplicate server state into another client store without a concrete reason.

## Data fetching

When working with Todo or another plugin that already uses TanStack Query:

- keep server state in TanStack Query;
- keep query keys owned by the plugin;
- use the existing `QueryClientProvider`;
- do not create another `QueryClient` inside the plugin.

Do not introduce another data-fetching abstraction without a concrete reason.

## Styling

The project uses Tailwind CSS as the primary styling approach.

Prefer Tailwind utility classes for component and page styling.

Use existing project styling patterns when extending an existing component.

Do not introduce a new SCSS/CSS module for a component when the styling can reasonably be implemented with Tailwind.

Do not create UI components solely because a Tailwind class list is long.

Do not use `[].join(" ")` as a substitute for a styling abstraction.

Create reusable UI components when they represent a meaningful reusable UI concept or materially improve the structure of the code.

Create UI components with responsive design

Use CSS/SCSS only when there is a concrete reason that Tailwind is not an appropriate solution, for example:

- complex selectors;
- pseudo-elements or advanced CSS behavior that would be substantially less readable with utilities;
- animations or styling that is easier to maintain as CSS;
- styling of third-party/library-generated markup;
- an existing component already intentionally uses SCSS/CSS and continuing that approach avoids unnecessary migration.

Do not introduce SCSS for convenience when equivalent Tailwind utilities are sufficient.

## Comments

Comments should explain:

- non-obvious architectural decisions;
- important constraints;
- workarounds;
- behavior that is difficult to understand from the code.

Do not add comments that simply restate the implementation.

## Error handling

Do not silently swallow meaningful errors.

When an operation can fail, preserve enough information for the appropriate UI or boundary to handle the failure.

Do not introduce a second error-handling mechanism when an existing project mechanism is sufficient.