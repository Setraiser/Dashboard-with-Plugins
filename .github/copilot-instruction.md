# Project Instructions

This is a learning-oriented portfolio project built with Next.js, React and TypeScript.

The project demonstrates:

- plugin-based architecture;
- isolated plugin implementations;
- registry-based lazy plugin loading;
- host/plugin dependency boundaries;
- FSD-inspired host structure;
- authentication and session management;
- frontend/backend interaction;
- TanStack Query for server state;
- MobX for Todo draft state;
- Prisma and PostgreSQL;
- automated tests;
- production deployment with Vercel and Neon.

The project is intentionally smaller than an enterprise application.

Prefer solutions that are appropriate for the current project size. Do not introduce enterprise-scale abstractions without a concrete requirement.

## Current architecture

The project has three important plugin-related areas:

- `src/plugin-runtime/*` — generic host runtime infrastructure;
- `src/plugins/*` — plugin implementations and their public contracts;
- `src/plugin-host/*` — host-side integration for individual plugins, including API/server integration.

The host application also uses an FSD-inspired structure:

- `app`
- `widgets`
- `features`
- `entities`
- `shared`

The project uses pragmatic FSD rather than enforcing every FSD convention mechanically.

## Important architectural boundaries

### Plugin implementation

Code under `src/plugins/*` represents portable plugin code.

Plugin implementation should not depend on host-specific FSD layers such as:

- `src/app/*`
- `src/features/*`
- `src/entities/*`
- `src/widgets/*`

A plugin may use:

- its own files;
- stable public contracts from `src/plugin-runtime/*`;
- explicitly shared APIs from `src/shared/*`.

Do not import host UI or host feature implementations into a plugin.

### Plugin runtime

`src/plugin-runtime/*` contains generic infrastructure.

It is responsible for concepts such as:

- plugin registration;
- lazy loading;
- plugin runtime types;
- plugin mounting;
- plugin error isolation.

Do not put Todo-specific or other plugin-specific business logic into the generic runtime.

### Plugin host integration

`src/plugin-host/*` contains host-side integration for a particular plugin.

It may contain:

- HTTP API clients;
- server-side requests;
- authentication integration;
- Prisma access;
- validation;
- adapters between host infrastructure and plugin contracts.

Plugin-host code is not the portable plugin implementation.

Do not move plugin UI or plugin-specific client state into `plugin-host` merely because the host needs server integration.

## Plugin loading

The current runtime uses static registration with lazy loaders.

The registry maps plugin IDs to dynamic import functions.

Do not introduce another registration mechanism unless the current registry cannot solve a concrete requirement.

Do not add remote plugin loading, marketplace infrastructure, package discovery, or database-driven plugin registration unless explicitly requested.

## Plugin contract

The current runtime plugin module contains:

- `manifest`;
- `Widget`;
- optional `dispose`.

The current manifest contains:

- `id`;
- `version`;
- `displayName`;
- optional `configSchema`.

Do not treat future concepts as implemented features.

In particular, the current runtime does not provide a complete implementation for:

- plugin permissions;
- manifest API-version validation;
- configuration migrations;
- remote bundles;
- package marketplace/discovery.

Do not implement these merely because they could be useful in the future.

## Plugin dependencies

Plugin dependencies are injected by the host runtime.

The runtime currently passes dependencies as a generic object.

Individual plugins are responsible for validating/narrowing their dependency contract at their own boundary when necessary.

For example, Todo owns its Todo dependency contract and validates the injected runtime dependencies through its adapter.

Do not make the generic runtime know Todo-specific dependency types.

## State ownership

Distinguish between:

- server state;
- host UI state;
- plugin UI/local state;
- derived state.

Current examples:

- dashboard-level state uses Zustand;
- Todo server state uses TanStack Query;
- Todo unsaved draft changes use MobX.

Do not force every part of the application to use the same state-management library.

Do not copy server state into MobX or another client store without a concrete reason.

## Server/client boundaries

Server-only code includes:

- authentication/session lookup;
- Prisma;
- server-side database operations;
- server-side authorization;
- server-only API/domain integration.

Client components must not import server-only modules.

The client-facing plugin API is an HTTP API client. It must not directly access Prisma, `cookies()`, `requiredUser()`, or other server-only infrastructure.

The intended Todo request chain is:

Todo plugin
→ Todo API client
→ HTTP `/api/plugins/todo`
→ Route Handler
→ authentication/server integration
→ Prisma
→ PostgreSQL

Route Handlers own HTTP concerns such as parsing requests and returning HTTP responses.

Server/domain functions should not return `NextResponse`.

## Public contracts

Plugin public contracts should belong to the plugin that owns the domain.

For example, Todo domain types are exported from:

`src/plugins/todo`

The plugin must not expose Prisma-generated database types as its public domain contract.

Host/server code may translate between plugin domain values and Prisma values.

## TypeScript

- Avoid `any` unless there is a concrete and justified reason.
- Avoid unnecessary type assertions.
- Prefer explicit domain types at public boundaries.
- Do not introduce complex generic abstractions only for type-level perfection.
- Do not duplicate domain types when an existing public contract already represents the concept.

## React

- Prefer functional components.
- Prefer composition.
- Keep components focused on a meaningful responsibility.
- Do not create components merely to shorten a JSX file or className.
- Do not create hooks merely to move a few lines of code.
- Separate non-trivial data loading/orchestration from presentation when this materially improves readability or testing.
- Keep plugin UI inside the plugin that owns it.

## FSD

The host uses an FSD-inspired structure, not a rigid textbook implementation.

Use a layer according to responsibility.

Do not move code between layers only to satisfy a naming rule.

Avoid creating an entity, feature, widget, or shared utility when the code has no meaningful independent responsibility.

Plugin-specific FSD-like organization should remain inside the plugin rather than leaking plugin internals into host FSD layers.

## Styling

Use the project's existing styling approach.

Prefer existing UI patterns over introducing a new styling system.

Do not create abstractions solely to hide long Tailwind class lists.

Do not use arrays joined with spaces as a substitute for a reusable styling abstraction.

Create a shared UI component only when there is a real reusable UI concept or when it materially improves the structure of the code.

## Backend and database

Use the existing Prisma/PostgreSQL architecture.

Do not access Prisma from client components.

Do not expose database models directly when a domain/API contract is more appropriate.

Validate external input at the HTTP boundary.

Keep authorization on the server.

Do not introduce a second backend/data-access architecture without a concrete reason.

## Authentication

Authentication and authorization are server responsibilities.

Protected pages and server operations should use the existing authentication/session infrastructure.

Do not duplicate session validation logic in individual features or plugins.

Do not expose session tokens or password hashes to client code.

## Testing

Tests should follow ownership.

Prioritize tests for:

- important business logic;
- plugin behavior;
- state-management behavior;
- API route behavior;
- authentication behavior;
- meaningful user scenarios.

Do not add tests for trivial implementation details merely to increase coverage.

Prefer testing observable behavior and public boundaries.

## Changes and refactoring

Before a non-trivial change:

1. Inspect the existing implementation.
2. Identify the owning architectural layer.
3. Check existing patterns and contracts.
4. Explain the proposed approach.
5. Mention important trade-offs if there are meaningful alternatives.

If a change requires a significant architectural decision:

- explain the alternatives;
- explain the consequences;
- ask for confirmation before making the architectural change.

Do not perform broad refactors as part of an unrelated task.

Do not modify unrelated files.

Do not silently change public contracts or architectural boundaries.

## Verification

After a meaningful code change, run the most relevant verification available.

Depending on the change, this may include:

- tests;
- lint;
- TypeScript checking;
- production build.

Do not claim that a change works without verification when verification is possible.

## Future architecture

The project may eventually support plugins distributed as separate packages.

Current boundaries should remain reasonably compatible with that direction.

However, future package distribution is not a reason to introduce abstractions that have no current use case.