---
applyTo: "src/plugin-host/**/*.{ts,tsx}"
---

# Plugin Host Integration Instructions

`src/plugin-host/*` contains host-side integration for individual plugins.

It is intentionally separate from both:

- the generic plugin runtime;
- the portable plugin implementation.

## Responsibilities

Plugin-host code may contain:

- plugin-specific HTTP clients;
- server-side plugin requests;
- request validation;
- Prisma access;
- authentication/authorization integration;
- mapping between plugin domain contracts and persistence models.

## Todo example

The Todo integration currently follows:

```text
Todo plugin
    ↓
Todo API contract
    ↓
Todo API client
    ↓
/api/plugins/todo
    ↓
plugin-host/todo server requests
    ↓
authHandler
    ↓
Prisma
    ↓
PostgreSQL
```

Keep these boundaries intact.

Prisma

Prisma belongs to server-side integration.

Do not import Prisma from:

src/plugins/todo/*;
client components;
generic plugin runtime.

When Prisma values differ from plugin domain values, map between them at the server boundary.

Do not expose Prisma-generated types as the plugin's public domain API.

Authentication

Authentication and authorization belong on the server.

Use the existing authentication infrastructure rather than duplicating session checks in each request.

Plugin-specific server operations should use the existing authHandler/requiredUser flow where appropriate.

API clients

A plugin API client should be a transport layer.

It may know:

endpoint URLs;
HTTP methods;
request bodies;
response contracts.

It must not know:

Prisma;
session cookies;
requiredUser;
server-only authentication internals.
Route handlers

Route handlers under src/app/api/* own HTTP concerns.

They should:

parse/validate request input;
call the appropriate server operation;
return the HTTP response.

Do not move NextResponse or HTTP-specific response construction into domain/server request functions unless there is a concrete reason.

Validation

Validate untrusted HTTP input at the route boundary.

Use the existing validation schema for the plugin.

Do not rely on TypeScript types as runtime validation.

Ownership

Do not move client/plugin business logic into plugin-host.

Do not move generic runtime behavior into plugin-host.

If logic is generic across plugins, it belongs in plugin-runtime.

If logic belongs to the plugin's UI/domain, it belongs in src/plugins/<plugin>.

If logic connects the plugin to host/server infrastructure, it may belong in plugin-host.