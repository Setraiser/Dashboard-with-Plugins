---
applyTo: "src/plugin-runtime/**/*.{ts,tsx}"
---

# Plugin Runtime Instructions

`src/plugin-runtime/*` contains generic host runtime infrastructure.

The runtime must remain independent of individual plugin business logic.

## Responsibilities

The runtime currently owns:

- plugin registration;
- plugin lookup;
- lazy plugin loading;
- runtime plugin types;
- plugin mounting;
- plugin error isolation.

## Registry

The current registration model is static.

The registry maps:

```text
plugin id → lazy loader

Plugins are loaded through dynamic imports.

Use the existing registry instead of introducing another plugin discovery or registration mechanism.

The default registry is currently initialized through:

src/plugin-runtime/model/registry/default-registry.ts

Do not create a second registry.

Plugin module

The current plugin module contract includes:

manifest;
Widget;
optional dispose.

The manifest currently contains:

id;
version;
displayName;
optional configSchema.

Do not add validation or lifecycle behavior that is not required by an actual runtime use case.

PluginSlot

PluginSlot is the current runtime boundary that:

receives a plugin instance configuration;
loads the plugin;
obtains injected dependencies;
mounts the plugin widget;
wraps rendering with plugin error isolation.

Do not make PluginSlot aware of Todo-specific or other plugin-specific behavior.

Do not turn PluginSlot into a collection of plugin-specific conditionals.

Dependency injection

The runtime passes plugin dependencies without knowing their plugin-specific structure.

Individual plugins own their concrete dependency contracts.

Do not add Todo-specific types or logic to the generic runtime merely to improve type inference.

If generic typing becomes insufficient, prefer a small explicit adapter at the plugin boundary.

Error isolation

Plugin failures should not unnecessarily crash the entire dashboard.

Keep plugin rendering isolated through the existing plugin error boundary.

Do not introduce a second unrelated error-boundary system specifically for plugins unless there is a concrete requirement.

Lifecycle

dispose is available for module-level plugin resources.

Instance-level cleanup belongs to the component/store that owns the instance.

Do not add lifecycle complexity without a resource that actually needs cleanup.

Genericity

Do not add:

permissions;
remote bundles;
package discovery;
manifest migrations;
API version negotiation;
rollout/kill-switch infrastructure;

to the runtime unless the project gains a concrete requirement for them.

The runtime should solve current host/plugin integration problems, not hypothetical enterprise requirements.