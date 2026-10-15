# Dashboard with Plugins

Dashboard with Plugins is a Next.js-based demo application for a modular dashboard where the host app loads isolated plugins and renders them in a shared shell. The project focuses on plugin boundaries, host-plugin integration, authentication, and a clean runtime model that keeps portable plugin code separate from host-specific infrastructure.

## Project overview

The application combines:

- a protected dashboard UI built on Next.js App Router;
- plugin registration and lazy loading through a generic runtime;
- host-side integration adapters for each plugin;
- a relational data layer via Prisma and PostgreSQL;
- user auth and session handling;
- localized UI using next-intl;
- plugin-specific UI and state patterns, including server state and local draft state.

The goal is not to build a full enterprise plugin marketplace, but to demonstrate a pragmatic architecture for a dashboard that can extend itself without entangling host logic with plugin logic.

## Tech stack

- Next.js 16 + React 19 + TypeScript
- App Router and Route Handlers
- Prisma + PostgreSQL
- TanStack Query for server state
- Zustand for host state
- MobX for local plugin draft state
- next-intl for localization
- Jest + Testing Library for unit/UI tests

## Architecture

The project is organized into four main layers:

```text
src/
├── app/                    # Next.js App Router pages and API routes
├── features/               # Host-level features (auth, navigation, shell, etc.)
├── widgets/                # Host widgets composing larger UI regions
├── entities/               # Shared domain concepts and host-level models
├── shared/                 # Shared utilities, host types, and server helpers
│
├── plugin-runtime/         # Generic plugin registry, runtime types, dependency resolution
├── plugin-host/            # Host integration for each plugin (API, validation, server contracts)
├── plugins/                # Portable plugin implementations
├── i18n/                  # Host locale configuration
└── host-i18n/             # Host translations
```

### Host app

The host is responsible for:

- app routing and protected dashboard pages;
- authentication boundaries;
- plugin navigation and dashboard shell;
- plugin registry and loading flow;
- shared infrastructure and cross-cutting concerns.

### Plugin runtime

The runtime is generic and plugin-agnostic. It includes:

- plugin manifests;
- static plugin registration;
- lazy loading via dynamic imports;
- dependency injection contracts;
- plugin mounting through a slot/error-boundary pattern.

The main idea is that the host should not know plugin-specific business logic; it only knows how to load, render, and provide dependencies.

### Plugin host integration

The `src/plugin-host` layer is where each plugin is connected to the host environment. It contains:

- API clients used by plugin widgets;
- validation schemas;
- request helpers for server-side data access;
- Prisma-backed integrations where necessary.

This keeps runtime code reusable while allowing plugin-specific integration logic to live next to the plugin it serves.

### Portable plugins

Each plugin under `src/plugins/*` is designed to be mostly self-contained and portable. Plugins manage:

- UI;
- local and server state;
- plugin-specific business logic;
- plugin-scoped tests and metadata.

The host supplies the shell, runtime, and dependencies, but the plugin owns its implementation details.

## Registered plugins

The default registry currently includes two plugins:

```ts
[
  { id: "todo", loader: () => import("@/plugins/todo") },
  { id: "falling-clicker", loader: () => import("@/plugins/falling-clicker") },
]
```

## Plugins

### 1) Todo

Location: `src/plugins/todo`

The Todo plugin is a task manager for the dashboard. It provides:

- creating, deleting, and editing tasks;
- completion status tracking;
- priority and filtering controls;
- search by text;
- local draft editing via MobX;
- server synchronization via TanStack Query and a plugin-host API layer.

It demonstrates the split between host/server state and plugin local state:

- server data → TanStack Query;
- unsaved in-memory edits → MobX.

The plugin is exposed to the host through an adapter and a dependency contract (`todoApi`).

### 2) Falling Clicker

Location: `src/plugins/falling-clicker`

The Falling Clicker plugin is a small arcade mini-game built in the dashboard. It includes:

- a falling-object gameplay loop;
- score calculation, health, and timer logic;
- a Pixi.js-based canvas rendering layer;
- best-score persistence through a host-provided API;
- localized UI and game instructions.

It shows how a plugin can be integrated with the host without leaking host-specific rules into the plugin implementation itself.

## Typical runtime flow

```text
User opens dashboard
    ↓
Host loads plugin registry
    ↓
Plugin module is lazy-loaded
    ↓
Plugin dependencies are injected
    ↓
PluginSlot mounts the plugin inside a safe error boundary
    ↓
Plugin Widget renders in the dashboard shell
```

## Local development

Requirements:

- Node.js 20+
- PostgreSQL instance for Prisma
- environment variables configured for the app and Prisma

Typical commands:

```bash
npm install
npm run dev
```

If the project uses Prisma against a local or remote PostgreSQL database, make sure `DATABASE_URL` is available before running the app or generating the client:

```bash
npx prisma generate
```

## Testing

Run the unit and UI tests with:

```bash
npm run test:unit
```

## Notes

This repository intentionally uses a pragmatic architecture rather than a full enterprise plugin platform. The focus is on clear boundaries, real integration examples, and a simple host/plugin model that is easy to understand and extend.
