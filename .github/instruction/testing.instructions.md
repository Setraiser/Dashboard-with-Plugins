---
applyTo: "**/*.{test,spec}.{ts,tsx}"
---

# Testing Instructions

Tests should verify observable behavior and important architectural boundaries.

Prefer meaningful tests over maximizing line coverage.

## General principles

- Test behavior, not implementation details.
- Prefer public APIs and user-visible behavior.
- Reuse existing project test patterns.
- Do not mock something merely because it is possible.
- Do not add tests for trivial wrappers when they provide no meaningful behavior.
- Keep tests focused on one responsibility.

A test should make it clear:

1. what behavior is being tested;
2. under which conditions;
3. what result is expected.

## Test ownership

Place tests close to the code they describe when that matches the existing project structure.

Use the test level appropriate to the responsibility.

```text
pure function
    → unit test

store/business logic
    → unit test

React component
    → component/integration test

user scenario
    → integration test

API Route Handler
    → API/route test

server operation
    → server/business test

plugin runtime
    → runtime/contract test

Do not test the same behavior at many levels without a reason.

Unit tests

Use unit tests for isolated logic with meaningful behavior.

Good candidates include:

state transitions;
validation helpers;
mapping functions;
domain utilities;
plugin adapters;
MobX store behavior.

For the Todo store, important behavior includes:

adding draft changes;
merging changes for the same Todo;
toggling completion;
changing priority;
changing text;
generating update payloads;
clearing changes.

Do not test that a trivial getter simply returns a private field unless the getter has meaningful behavior.

React component tests

Prefer testing what the user can observe.

Test:

rendered content;
interactions;
loading states;
error states;
disabled states;
important conditional rendering;
integration with the relevant state/query layer.

Avoid tests that depend heavily on:

internal component structure;
implementation-specific class names;
exact hook call counts;
private functions.

Do not rewrite a component solely to make implementation details easier to test.

Integration tests

Use integration tests when several pieces must work together to provide meaningful behavior.

Examples:

Todo editing followed by saving;
creating a Todo and updating the displayed server state;
deleting a Todo with optimistic UI and rollback;
plugin shell loading and rendering a plugin;
plugin navigation changing the active plugin.

Prefer a realistic user scenario over testing every internal function separately.

TanStack Query

When testing code that uses TanStack Query:

use the project's existing QueryClientProvider pattern;
isolate query state between tests;
avoid leaking cache state from one test into another;
test observable query/mutation behavior rather than TanStack Query internals.

For mutations, test important behavior such as:

successful mutation;
invalidation/refetch;
optimistic update where applicable;
rollback on failure where applicable.

Do not test TanStack Query itself.

MobX

When testing MobX stores:

test observable behavior through the store's public methods/getters;
verify state transitions;
verify generated update payloads;
verify that multiple changes to the same entity are merged correctly.

Do not test MobX internals such as makeAutoObservable.

API Route Handlers

Route tests should verify the HTTP boundary.

Important cases include:

valid request;
invalid request body;
authentication failure;
authorization/ownership failure;
successful response;
relevant server error.

Test the contract rather than the internal implementation of the server operation.

For example, if a route delegates to a server request function, do not duplicate all database business-rule tests inside the route test.

Server operations

Server-side tests should verify meaningful business and persistence behavior.

For Todo this includes cases such as:

returning only the authenticated user's Todos;
creating a Todo for the authenticated user;
updating owned Todos;
rejecting access to another user's Todo;
deleting only owned records;
updating multiple Todos atomically where required.

Do not test Prisma's own behavior.

Plugin boundaries

Plugin architecture is an important part of this project.

When appropriate, tests should verify that:

plugins can be loaded through the registry;
invalid plugin dependencies are rejected at the plugin boundary;
plugin rendering failures are isolated;
public plugin contracts remain compatible with their consumers.

Do not test internal implementation details merely because they are part of the plugin system.

Mocks

Mock external boundaries when isolation is important.

Avoid mocking the code under test.

Prefer realistic implementations for small pure utilities.

When mocking:

keep mocks minimal;
make the mocked behavior explicit;
reset mocks between tests;
avoid global mocks that affect unrelated tests.

Do not mock Prisma in every test by default.

Choose between unit/integration/database tests according to the behavior being verified.

Authentication tests

Authentication-related tests should verify behavior at the relevant boundary.

Important cases include:

unauthenticated request;
authenticated request;
expired/invalid session where relevant;
access to owned data;
rejection of unauthorized access.

Do not test authentication library internals.

Regression tests

When fixing a bug:

reproduce the bug;
add a test that fails before the fix when practical;
implement the fix;
verify that the regression test passes;
run the relevant existing tests.

Do not remove an existing regression test merely because the implementation changed.

Test changes

When adding or changing functionality, consider whether the behavior requires a test.

Do not automatically add tests for every changed line.

Prioritize tests for:

business rules;
state transitions;
API contracts;
authentication/authorization;
plugin boundaries;
important user scenarios.
Verification

After meaningful changes, run the narrowest relevant test set first.

Then run the broader test suite when appropriate.

If tests cannot be run, report that explicitly.

Do not claim that tests pass without actually running them.