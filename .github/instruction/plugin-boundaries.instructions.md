---
applyTo: "src/plugins/**/*.{ts,tsx}"
---

# Plugin Boundaries

Code under `src/plugins/*` is the portable plugin implementation.

A plugin should be treated as an isolated mini-application.

## Allowed dependencies

Plugin implementation may import:

- files from the same plugin;
- stable public contracts from `src/plugin-runtime/*`;
- explicitly shared public APIs from `src/shared/*`.

Prefer the plugin's own public API for exposing domain types and contracts.

## Forbidden host dependencies

Plugin implementation must not directly import host-specific FSD layers:

- `src/app/*`
- `src/features/*`
- `src/entities/*`
- `src/widgets/*`

Do not make a plugin depend on host UI or host feature implementations.

If a plugin needs a host capability, use an existing runtime/dependency boundary or discuss introducing one.

## Plugin host integration

`src/plugin-host/*` is host-side integration and is separate from the portable plugin implementation.

Plugin-host code may:

- use Prisma;
- use server-only authentication;
- implement HTTP/API clients;
- implement server-side plugin requests;
- validate HTTP input;
- connect plugin contracts to host infrastructure.

Do not move plugin UI or plugin-local state into `plugin-host` merely because the host needs server integration.

## Public plugin API

A plugin should expose only the contracts that the host or other explicitly allowed code needs.

For Todo, the public API is exposed from:

`src/plugins/todo/index.ts`

Do not import Todo internals from unrelated host code when an exported public contract exists.

## Runtime dependencies

The generic runtime may pass dependencies to a plugin as a generic object.

The plugin owns the concrete dependency contract.

A plugin may validate and narrow the injected dependency object at its adapter boundary.

Do not add plugin-specific dependency types to the generic runtime.

## State isolation

Plugins must not directly access mutable state owned by another plugin.

Plugin-specific state remains inside the plugin unless explicitly exposed through a public contract.

## Server boundaries

Plugin client code must not import:

- Prisma;
- `cookies()`;
- `requiredUser()`;
- server-only authentication;
- server-only database functions.

Use the plugin's HTTP API client for client/server communication.

The expected pattern is:

```text
Plugin UI
    ↓
plugin API client
    ↓
HTTP API route
    ↓
server-side plugin integration
    ↓
authentication/authorization
    ↓
Prisma
Host coupling
```

Do not add imports from host features/widgets merely to reuse a UI component.

If a UI element is genuinely shared across the whole application, it may belong in an appropriate shared UI layer.

If it is plugin-specific, keep it inside the plugin.

Package portability

The plugin should remain reasonably movable to a separate package in the future.

Do not introduce host-relative imports into plugin implementation.

Do not import application-specific implementation details merely because they are convenient.
