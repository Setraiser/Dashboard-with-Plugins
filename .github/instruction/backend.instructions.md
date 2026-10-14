---
applyTo: "src/app/api/**/*.{ts,tsx},src/plugin-host/**/*.{ts,tsx},src/shared/**/*.{ts,tsx}"
---

# Backend Instructions

Backend code is responsible for HTTP handling, authentication/authorization, validation, server-side business operations, persistence and integration with the database.

Prefer the existing project architecture over introducing new backend abstractions.

## Server-only code

Server-only code must not be imported into client components.

Server-only responsibilities include:

- authentication and session lookup;
- authorization;
- Prisma;
- database access;
- server-side domain operations;
- server-only request handling.

Do not expose:

- Prisma clients;
- session tokens;
- password hashes;
- server-only authentication utilities

to client code.

## Route Handlers

Next.js Route Handlers under `src/app/api/*` own HTTP concerns.

A Route Handler should generally be responsible for:

1. receiving the HTTP request;
2. parsing the request;
3. validating external input;
4. calling the appropriate server operation;
5. returning the HTTP response.

Keep business and persistence logic outside Route Handlers when it has meaningful independent responsibility.

Do not put large database operations or business workflows directly into a Route Handler.

Do not make lower-level server/domain functions return `NextResponse` unless there is a concrete architectural reason.

## Validation

Treat all data received through HTTP as untrusted.

Validate request bodies, query parameters and other external input at the appropriate boundary.

Do not rely on TypeScript types for runtime validation.

Use the project's existing validation approach and schemas.

Do not duplicate validation rules in multiple layers without a concrete reason.

Validation should establish that the input has the expected shape and values.

Authorization must still be performed separately.

## Authentication and authorization

Authentication and authorization are server responsibilities.

Use the existing authentication infrastructure instead of implementing session checks independently in every endpoint.

For protected server operations, use the existing `authHandler` / `requiredUser` flow where appropriate.

Do not assume that a valid request is authorized merely because its input passed validation.

When accessing user-owned data, verify ownership on the server.

For example, Todo operations must operate on records belonging to the authenticated user.

Do not rely on the client to provide or enforce ownership.

## Server request/service layer

Server-side business and data operations should remain separate from HTTP response construction.

The general structure is:

```text
Route Handler
    ↓
validation
    ↓
authentication/authorization
    ↓
server operation
    ↓
Prisma

Server operations should work with domain/data values rather than Request and NextResponse objects when possible.

Do not pass HTTP-specific objects deep into the server layer merely for convenience.

Prisma

Prisma is a server-side persistence implementation detail.

Do not import Prisma from:

client components;
```
src/plugins/*;

generic plugin runtime code.

Keep database access in server-side code.

When database models differ from public domain/API contracts, map between them explicitly.

Do not expose Prisma-generated model or enum types as public plugin contracts merely because they are convenient.

For example, plugin domain values may use:

TodoPriority.Low

while Prisma may use its own generated enum representation.

The mapping belongs at the server/persistence boundary.

Database ownership

When reading or modifying user-owned data:

obtain the authenticated user;
constrain database queries by the authenticated user's identity;
do not fetch a record by ID and assume that the client is allowed to access it.

Prefer enforcing ownership in the database query itself where practical.

Avoid patterns where authorization is checked only after unrelated data has already been loaded.

Transactions

Use Prisma transactions when multiple database operations must succeed or fail together.

Do not introduce transactions for a single simple operation without a concrete reason.

Keep transaction scope as small as practical.

Do not move unrelated operations into the same transaction merely for convenience.

API contracts

Client-facing APIs should use explicit domain/API contracts.

Do not expose internal Prisma structures as the HTTP contract unless that is an intentional design decision.

When an API contract already exists, reuse it instead of creating a second representation of the same domain concept.

Keep transport concerns separate from domain concerns where the distinction is meaningful.

Plugin host integration

Plugin-specific backend integration belongs in:

src/plugin-host/*

This layer may contain:

API clients;
server requests;
validation;
Prisma integration;
authentication integration;
mappings between plugin contracts and persistence models.

It must not make the generic plugin runtime aware of plugin-specific backend details.

The plugin implementation under src/plugins/* 
should communicate with the backend through its public API/dependency contract rather than importing server implementation details.

Error handling

Use the existing project error-handling mechanisms.

Do not silently swallow meaningful errors.

Do not expose internal implementation details, database errors or sensitive information directly to clients.

Errors returned to clients should contain only information that the client actually needs.

Do not create a separate error-handling architecture for one endpoint when the existing mechanism is sufficient.

HTTP semantics

Use appropriate HTTP methods and status codes.

Follow the existing API conventions in the project.

Do not change an established endpoint's request or response contract without considering all consumers.

When changing an API contract, update the relevant client, validation, tests and documentation as necessary.

Data fetching

The client should use the existing API clients and data-fetching mechanisms.

Do not access backend endpoints directly from arbitrary UI components when an existing plugin API client already owns that communication.

For Todo, the intended flow is:

Todo UI
    ↓
ITodoApi
    ↓
todoApi
    ↓
/api/plugins/todo
    ↓
Route Handler
    ↓
plugin-host/todo server operation
    ↓
authHandler
    ↓
Prisma

Do not bypass this structure without a concrete reason.

Changes to the database

When changing the Prisma schema:

consider the effect on existing data;
use Prisma migrations for schema changes;
do not use prisma db push as a substitute for production migrations;
update affected server operations and contracts;
update relevant tests.

Do not modify the database schema merely to simplify a frontend representation.

Backend architecture changes

Do not introduce:

a second ORM;
a second validation library;
a second authentication mechanism;
a new API abstraction;
a repository/service layer hierarchy;

unless the existing architecture has a concrete limitation that requires it.

Before introducing a new backend abstraction, explain why the existing structure is insufficient.

Scope

Prefer the smallest change that correctly solves the problem.

Do not refactor unrelated backend code while implementing a feature.

Do not move code between layers merely to make the folder structure look more theoretically correct.