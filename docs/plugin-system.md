# Plugin System

## Purpose

The plugin system allows the Next.js host application to load isolated plugin implementations through a generic runtime.

The current implementation is intentionally simple.

It provides:

- static registration;
- lazy loading;
- plugin manifests;
- plugin widgets;
- injected plugin dependencies;
- plugin rendering isolation.

It does not currently implement a complete remote or marketplace plugin platform.

---

# Current Architecture

Plugin-related code is divided into three areas:

```text
src/plugin-runtime/
    Generic runtime infrastructure

src/plugin-host/
    Host/server integration for individual plugins

src/plugins/
    Portable plugin implementations
```

The distinction is important.

**`src/plugin-runtime`**
Generic runtime infrastructure.

**`src/plugin-host`**
Host-side integration for a particular plugin.

**`src/plugins`**
The actual plugin implementation.

## Registration

The current registry is static.

The default registry is located at:
`src/plugin-runtime/model/registry/default-registry.ts`

It registers plugins using an ID and lazy loader.

Conceptually:

```typescript
{
  id: "todo",
  loader: () => import("@/plugins/todo")
}
```

The registry itself is located at:
`src/plugin-runtime/model/registry/registry.ts`

It provides:

- `registerPlugins`;
- `getRegisteredPluginIds`;
- `loadPlugin`.

Do not introduce another plugin registration mechanism unless the current registry cannot satisfy a concrete requirement.

## Lazy Loading

Plugins are loaded through dynamic imports.

The loader returns the plugin module and the runtime mounts its Widget.

The current flow is approximately:

```text
plugin ID
    ↓
registry
    ↓
lazy loader
    ↓
plugin module
    ↓
PluginSlot
    ↓
Widget
```

## Plugin Module Contract

The current runtime type is `PluginModule`.

A plugin module contains:

```typescript
interface PluginModule {
  manifest: PluginManifest;
  Widget: (props: PluginWidgetProps) => ReactNode;
  dispose?: () => void;
}
```

The current manifest contains:

```typescript
interface PluginManifest {
  id: string;
  version: string;
  displayName: string;
  description: string;
  configSchema?: PluginConfigSchema;
}
```

`displayName` is the plugin's title, while `description` briefly describes its
purpose. For example, the Todo plugin uses `displayName: "Todo"` and
`description: "Task Manager"`. Both fields are shown on the plugin navigation
cards.

The runtime also defines:

```typescript
interface PluginWidgetProps {
  instanceId: string;
  config: unknown;
  pluginDependencies: Record<string, unknown>;
  locale?: string;
}
```

These are the current runtime types.

Do not assume that every declared field is already used by application behavior.

The optional `locale` is a generic language identifier supplied by the host.
The host determines it from a saved user preference or the request's
`Accept-Language` header.
It is not an i18n instance and does not require a plugin to use the host's
translation library. The host owns locale selection; plugins own their
translation resources and may fall back to their default locale when none is
provided.

Plugins may also provide optional `localizedMetadata` in their manifest for
localized catalog descriptions. Plugin names always use the original
`displayName` from the manifest, regardless of locale. The plugin owns localized
descriptions; the host selects the best matching locale and falls back to the
manifest's default `description`.

## Current Plugin Contract vs Future Concepts

The following are not currently implemented as complete plugin-system capabilities:

- permissions;
- manifest API-version validation;
- configuration migrations;
- remote plugin bundles;
- marketplace/discovery;
- database-driven plugin enablement;
- dependency compatibility negotiation.

The project may eventually need some of these capabilities.

They should not be implemented merely because they are possible.

## Plugin Dependencies

The host can inject dependencies into a plugin instance.

The generic runtime treats them as:

```typescript
Record<string, unknown>
```

The concrete dependency contract belongs to the plugin.

Todo currently validates its injected dependencies in:
`src/plugins/todo/adapter/`

This keeps the generic runtime independent of Todo-specific types.

The desired direction is:

```text
Generic runtime
    ↓
generic dependency object
    ↓
plugin adapter
    ↓
plugin-specific dependency contract
```

Do not move plugin-specific dependency knowledge into the generic runtime.

## PluginSlot

`PluginSlot` is the current runtime component responsible for mounting a plugin.

It:

- loads the plugin;
- handles loading/error states;
- obtains the dependencies for the plugin;
- renders the plugin widget;
- wraps rendering with `PluginErrorBoundary`.

`PluginSlot` is a generic runtime component.

It must not contain conditionals such as:

```typescript
if (pluginId === "todo") {
  ...
}
```

unless there is a genuinely generic runtime concern.

Plugin-specific behavior belongs in the plugin or plugin-host integration.

## Plugin Error Isolation

Plugins are rendered inside `PluginErrorBoundary`.

A plugin rendering error should not unnecessarily crash the entire dashboard.

The runtime owns this isolation mechanism.

Do not introduce plugin-specific error-boundary implementations unless a concrete plugin requirement requires different behavior.

## Plugin State

Plugin state belongs to the plugin unless explicitly exposed through a contract.

Todo currently separates:

```text
TanStack Query
    ↓
server state

MobX
    ↓
unsaved local draft changes
```

Plugins should not directly access mutable state owned by other plugins.

## Todo Example

The current Todo architecture is:

```text
src/plugins/todo
│
├── public contract
├── adapter
├── entities
├── widgets
└── shared UI

src/plugin-host/todo
│
├── API client
├── server requests
├── validation
└── manifest/integration code
```

The Todo plugin exports its public types from:
`src/plugins/todo/index.ts`

The client API implementation is provided through host integration.

Todo's UI and domain-specific messages are translated from resources owned by
the Todo plugin in `src/plugins/todo/i18n/`. It creates its own `next-intl`
provider using the generic locale supplied through the runtime contract; it
does not import host translation files, provider, or i18n instance. API error
responses contain stable machine-readable codes; Todo maps Todo-specific codes
to its own localized messages, while generic host errors remain the host's
responsibility.

## Falling Clicker Example

Falling Clicker is a small PixiJS game plugin registered by the default
runtime. The implementation lives in `src/plugins/falling-clicker/`; its game
logic is plain TypeScript and does not depend on PixiJS. PixiJS handles the
canvas, drawing, and pointer input, while the plugin owns its English and
Russian resources.

The plugin communicates through its public `FallingClickerApi` contract. The
host implementation in `src/plugin-host/falling-clicker/` sends requests to:

- `GET /api/plugins/falling-clicker/best-score` to read the current user's
  record;
- `POST /api/plugins/falling-clicker/best-score` with `{ "score": number }` to
  submit a completed game's score.

Both operations use the existing session authentication. The server gets the
owner from the authenticated session, never from client input. PostgreSQL
stores one `GameBestScore` per `(userId, gameId)`, with a foreign key to
`User`; an atomic `GREATEST` upsert ensures a lower or concurrent submission
cannot overwrite a higher record. The API returns machine-readable errors,
including `GAME_SCORE_INVALID`, rather than localized messages.

The game remains playable if score requests receive `SESSION_EXPIRED`; its
score is then not persisted. This plugin does not add leaderboard or game
history functionality.

The server flow is:

```text
Todo Widget
    ↓
ITodoApi
    ↓
todoApi
    ↓
/api/plugins/todo
    ↓
plugin-host/todo
    ↓
authHandler
    ↓
Prisma
    ↓
PostgreSQL
```

## Portability

The long-term goal is to keep plugin implementations portable enough that a plugin could eventually be extracted into a separate package.

This does not mean that every plugin must already be independently publishable.

Current priorities are:

- clear public contracts;
- clear host/plugin boundaries;
- no host FSD imports from plugins;
- isolated plugin state;
- explicit dependency injection.

Package publishing and external distribution can be added later if needed.

## Future Architecture

Potential future capabilities include:

- plugins as separate workspace/npm packages;
- dependency compatibility rules;
- manifest versioning;
- plugin configuration;
- plugin discovery;
- tenant/user-specific plugin enablement;
- remote plugin loading.

These are roadmap ideas, not current runtime requirements.

Do not implement them unless a concrete project requirement appears.