# Project Architecture

## Overview

This project is a learning-oriented portfolio application built with Next.js, React and TypeScript.

It demonstrates a host application that can load isolated plugins while also providing:

- authentication and sessions;
- REST-style API routes;
- server-side authorization;
- Prisma;
- PostgreSQL;
- TanStack Query;
- MobX;
- Zustand;
- automated tests;
- production deployment.

The architecture is intentionally pragmatic.

It is not intended to reproduce a full enterprise plugin platform.

---

## High-Level Structure

The project can be viewed as four major areas:

```text
Next.js Host
│
├── Host UI / routing
├── Plugin Runtime
├── Plugin Host Integration
└── Plugins
```

The relevant source directories are:
```text
src/
├── app/
├── features/
├── widgets/
├── entities/
├── shared/
│
├── plugin-runtime/
├── plugin-host/
└── plugins/
```
Host Application

The host is responsible for application-level concerns:

routing;
authentication boundaries;
dashboard shell;
plugin navigation;
plugin registration;
plugin loading;
plugin placement;
shared infrastructure.

The host uses an FSD-inspired structure:

app
widgets
features
entities
shared

This is a pragmatic use of FSD.

The project does not require every piece of code to fit a textbook FSD interpretation.

app

Next.js App Router routes and Route Handlers live here.

Examples:

src/app/(protected)/
src/app/(public)/
src/app/api/

Route files should remain relatively thin and delegate business/server work to appropriate modules.

features

Features represent meaningful host-level behavior.

Examples include:

authentication;
dashboard layout;
plugin navigation;
plugin shell.
widgets

Widgets compose larger UI areas.

Examples include:

authentication widget;
plugin tabs.
entities

Entities are used where a domain concept has a meaningful host-level representation.

Do not create entities merely to satisfy an FSD rule.

shared

Shared code contains infrastructure and utilities that are genuinely reusable across host areas.

Server-only code is kept under the server-oriented shared modules.

Plugin Architecture

Plugin-related code is intentionally divided into three areas.

src/plugin-runtime/
src/plugin-host/
src/plugins/

These areas have different responsibilities.

Plugin Runtime

src/plugin-runtime/*

The runtime provides generic host infrastructure:

registration;
plugin lookup;
lazy loading;
runtime types;
plugin mounting;
plugin error isolation.

The runtime must not contain plugin-specific business logic.

Plugin Implementation

src/plugins/*

Each directory represents a plugin implementation.

A plugin should own its:

UI;
domain contracts;
client state;
server-state integration;
plugin-specific business logic;
plugin-specific tests.

The plugin should remain reasonably portable and should not depend on host-specific FSD implementation details.

Plugin Host Integration

src/plugin-host/*

This contains host-side integration for a specific plugin.

It may contain:

API clients;
server requests;
validation;
Prisma access;
authentication integration;
mappings between plugin contracts and persistence models.

It is not part of the portable plugin implementation.

For example:

src/plugins/todo
    ↓
portable Todo plugin

src/plugin-host/todo
    ↓
host/server integration for Todo
Plugin Boundaries

The desired dependency direction is:

Host
 │
 ├── Plugin Runtime
 │
 ├── Plugin Host Integration
 │
 └── Plugin Implementation

Plugin implementation must not depend directly on host FSD layers such as:

app;
features;
widgets;
entities.

If a plugin needs a host capability, use an existing runtime/dependency boundary or introduce a small explicit contract when there is a concrete need.

State Ownership

The project distinguishes between different types of state.

Host state

State belonging to the dashboard itself belongs to the host.

The current dashboard layout uses Zustand.

Plugin server state

Remote data belongs to the server-state layer.

Todo currently uses TanStack Query for server state.

Plugin local state

Unsaved or purely local plugin state belongs to the plugin.

Todo currently uses MobX for unsaved draft changes.

The combination is intentional:

Server data
    ↓
TanStack Query

Unsaved Todo changes
    ↓
MobX

Do not automatically move server data into MobX.

Do not require every plugin to use the same state-management library.

Server Architecture

The application uses:

Next.js Route Handlers;
server-side authentication;
Prisma;
PostgreSQL.

The general request flow is:

Client/plugin
    ↓
HTTP API
    ↓
Route Handler
    ↓
Server/plugin-host operation
    ↓
Authentication/authorization
    ↓
Prisma
    ↓
PostgreSQL

Route Handlers own HTTP concerns.

Server/domain functions should not depend on HTTP response objects.

Authentication and authorization remain server-side.

Public Contracts

Domain contracts should be owned by the domain/plugin that defines them.

For example, Todo types are exposed from:

src/plugins/todo/index.ts

The plugin should not expose Prisma-generated database types as its public domain API.

Server integration may translate between plugin domain values and Prisma values.

Internationalization

The host owns the current application locale. A user-selected locale is
persisted in the `dashboard_locale` cookie; otherwise the host negotiates the
request's `Accept-Language` header. Supported locales are English (`en`) and
Russian (`ru`); English is the default when no supported preference is present.

Host UI translations live in `src/host-i18n/messages/` and are consumed by the
host through `next-intl`. Plugins must not import these resources or depend on
the host's provider or i18n instance. A plugin owns its own translation
resources; the Todo plugin keeps them under `src/plugins/todo/i18n/` and uses
its own `next-intl` provider and translation hooks within its UI.

The generic plugin runtime passes the locale as an optional string on
`PluginWidgetProps`. This communicates locale without coupling plugins to the
host's i18n implementation. A plugin must still work when the locale is absent
or unsupported by falling back to its own default language.

API errors use stable codes in the `{ error: { code, details? } }` response
contract rather than localized messages. The client converts these responses
into application errors. The host translates host-owned errors, while a plugin
translates its own domain errors using its own resources. Raw server and
infrastructure error messages are not user-facing translations.

Authentication

Authentication is implemented using application-managed sessions.

Relevant responsibilities include:

registration;
login;
session creation;
session lookup;
protected routes;
server-side authorization.

Server-only authentication code must not be imported into client components.

Protected pages use the existing authentication infrastructure rather than implementing their own session lookup.

Error Isolation

The project has two important error boundaries:

application-level error handling;
plugin-specific rendering isolation.

Plugin rendering is wrapped in PluginErrorBoundary so that a plugin failure does not necessarily crash the entire dashboard.

The generic runtime should remain responsible for this behavior.

Plugin-specific errors should remain understandable to the user without exposing internal server details unnecessarily.

Testing

Tests should follow ownership.

Examples:

src/app/api/**/*
    → route/API tests

src/features/**/*
    → feature tests where behavior is meaningful

src/features/dashboard-plugin-shell/**/*
    → shell tests

src/plugins/todo/**/*
    → plugin/domain/UI tests

Prefer testing observable behavior and important boundaries over implementation details.

Deployment

The project is deployed to a real production environment.

Current deployment architecture:

GitHub
   ↓
Vercel
   ↓
Next.js
   ↓
Neon PostgreSQL

Vercel uses the repository's production branch.

Neon is the production PostgreSQL database.

Prisma migrations are stored in:

prisma/migrations/

Production database migrations are applied with the existing Prisma migration workflow.

Production infrastructure should remain simple and appropriate for the size of this project.

Current Scope

The project is primarily a learning and portfolio project.

The main goal is to demonstrate meaningful engineering decisions, especially:

modular architecture;
plugin boundaries;
state ownership;
server/client separation;
API contracts;
authentication;
testing;
deployment.

The project does not need enterprise-scale infrastructure.

Future Direction

A possible future direction is distributing plugins as separate npm/workspace packages.

The current architecture should preserve reasonable boundaries for that possibility.

Potential future concerns include:

package boundaries;
dependency compatibility;
contract versioning;
plugin configuration;
plugin discovery.

These should only be implemented when a concrete requirement appears.

Do not build a complete marketplace, remote plugin system, or enterprise plugin platform speculatively.