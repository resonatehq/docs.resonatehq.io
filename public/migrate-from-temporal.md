# Migrate from Temporal to Resonate — Agent Playbook

> A structured, machine-readable guide for porting Temporal applications to
> Resonate. Hand this file (or its URL) to a coding agent and point it at a
> Temporal codebase. The human-readable companion lives at
> https://docs.resonatehq.io/evaluate/coming-from/temporal-migration

## How to use this playbook

1. Identify which Temporal construct each piece of the source uses (see DETECT).
2. Apply the matching TRANSFORM to produce the Resonate equivalent.
3. Pick the right RESOLVE/units API for the target SDK and **verify it against the
   pinned version** before emitting code — the SDK surface drifts between versions.
4. If a pattern is listed under COVERAGE GAPS for the target language, do not
   fabricate a worked example; tell the user it is a known gap and map the
   structure by analogy from another language.

## Ground rules (do not break these)

- **Never synthesize Temporal code.** Quote it from the user's source or from a
  named `temporalio/samples-*` file. If you can't find it, say so.
- **Resonate has no `@workflow`/`@activity` split.** A step is just a function
  made durable by `ctx.run`. Do not invent decorators.
- **Temporal has no Rust SDK.** If the target is Resonate-Rust, the source is the
  Temporal *TypeScript* idiom. State this.
- **State coverage honestly.** Missing example ≠ impossible; it means no worked
  reference exists yet.

## Pinned SDK versions (latest released at time of writing)

| SDK | Version | Source |
|---|---|---|
| TypeScript | `@resonatehq/sdk` v0.10.2 | npm |
| Python | `resonate-sdk` v0.6.7 | PyPI |
| Rust | `resonate-sdk` v0.4.0 | crates.io |
| Go | pre-release, tracks `main` | GitHub |

## Core mappings (apply everywhere)

| Temporal | Resonate |
|---|---|
| `@workflow.defn` / Workflow type | a registered function (`@resonate.register`, `resonate.register("name", fn)`, `#[resonate::function]`, `resonate.Register(r, "name", fn)`) |
| `@activity.defn` / Activity | a plain function invoked via `ctx.run(fn, args)` |
| `workflow.execute_activity(fn, …, start_to_close_timeout=…)` | `yield ctx.run(fn, args)` (no timeout policy required) |
| Task Queue + Worker wiring | worker `group` (only when you need distributed dispatch) |
| `executeChild` / `ExecuteChildWorkflow(ChildType, …)` | `ctx.rpc("name", args)` or `ctx.run(fn, args)` — invoke by registered name; recursion is trivial |
| `defineSignal` + `setHandler` + `condition` | one latent durable promise: `p = ctx.promise()` then await `p` |
| `defineQuery` / `setHandler(query, …)` | delete — promise/result state is the source of truth |
| `handle.signal(sig)` (external) | `resonate.promises.resolve(id, value)` (HTTP-addressable from anywhere) |
| `workflow.sleep` / `NewTimer` | `ctx.sleep(duration)` |
| saga compensation stack + drain-on-catch | inline `ctx.run(undo, …)` in the error branch, guarded by what completed |
| `continueAsNew` | for bounded loops: a plain loop. For unbounded loops: `ctx.detached(self, n+1)` tail-recursion |

---

## Pattern: Workflow + activity

- **DETECT:** `@workflow.defn`/`@activity.defn` (py), `proxyActivities` (ts),
  `RegisterWorkflow`+`RegisterActivity` / `workflow.ExecuteActivity` (go).
- **TRANSFORM:** Register one function. Turn each activity into a plain function
  called via `ctx.run`. Drop Task Queue wiring and `start_to_close_timeout`.
- **TEMPORAL SOURCE:** `samples-{python,typescript,go}/hello-world` (py:
  `hello/hello_activity.py`).
- **RESONATE TARGET:** `example-hello-world-{ts,py,rs,go}`.
- **COVERAGE:** ts ✅ py ✅ rs ✅ go ✅.

## Pattern: Composing functions (child workflows)

- **DETECT:** `executeChild` (ts), `workflow.ExecuteChildWorkflow` (go),
  `workflow.execute_child_workflow` (py).
- **TRANSFORM:** Replace the separate child Workflow type with a call to a
  registered function by name (`ctx.rpc("name", args)` / `ctx.run(fn, args)`). A
  function can recurse on itself. Optionally pin child ids with `.options(id=…)`.
- **TEMPORAL SOURCE:** `samples-typescript/child-workflows`,
  `samples-go/child-workflow`. (No `samples-python` child-workflow example.)
- **RESONATE TARGET:** `example-recursive-factorial-{ts,py,rs,go}`.
- **COVERAGE:** ts ✅ py ✅ rs ✅ go ✅.

## Pattern: Durable timers

- **DETECT:** `workflow.sleep(timedelta)` (py), `sleep('30 days')` (ts),
  `workflow.NewTimer` (go).
- **TRANSFORM:** Replace with `ctx.sleep(duration)`. **Mind the units:**
  - TypeScript: **milliseconds** (`ctx.sleep(ms)`).
  - Python: **seconds** as float (`ctx.sleep(secs)`).
  - Go: `time.Duration` (`ctx.Sleep(d)` then `f.Await(nil)`).
  - Rust: `std::time::Duration` (`ctx.sleep(Duration::from_secs(n)).await?`).
- **TEMPORAL SOURCE:** `samples-{python,typescript,go}/sleep-for-days`.
- **RESONATE TARGET:** `example-durable-sleep-{ts,py,rs,go}`.
- **COVERAGE:** ts ✅ py ✅ rs ✅ go ✅.

## Pattern: Signals → durable promises

- **DETECT:** `defineSignal`/`setHandler`/`condition`/`defineQuery` (ts),
  `@workflow.signal`/`workflow.wait_condition` (py),
  `workflow.GetSignalChannel`/`workflow.Await`/`Selector` (go).
- **TRANSFORM:** Replace the signal definition + handler + flag + condition with a
  single latent durable promise (`p = ctx.promise()`; await `p`). Surface
  `p.id` to whoever will resolve it (email/webhook/log). Replace
  `handle.signal(...)` with `resonate.promises.resolve(id, value)`. Delete Query
  handlers.
- **RESOLVE API — verify against pinned version:**
  - ts (0.10.2): `resonate.promises.resolve(id, { data: base64(JSON.stringify(v)) })`
  - py (0.6.7): `resonate.promises.resolve(id=…, ikey=…)`
  - rs (0.4.0): `resonate.promises.resolve(&id, Value::from_serializable(v)?)`
    (note: the example repo tracks `main` and uses `json!(v)`; on the released
    crate use `Value`)
  - go (main): **no high-level resolve yet** — use the CLI
    `resonate promises resolve <id> --value '{"data":"…"}'` or
    `r.Sender().PromiseSettle(...)` with a base64-encoded codec value.
    (resonate-sdk-go#28)
- **TEMPORAL SOURCE:** `samples-typescript/signals-queries`,
  `samples-python/hello/hello_signal.py`, `samples-go/await-signals`.
- **RESONATE TARGET:** `example-human-in-the-loop-{ts,py,rs,go}`.
- **COVERAGE:** ts ✅ py ✅ rs ✅ go ✅ (Go resolve is lower-level).

## Pattern: Saga / compensation

- **DETECT:** a compensation list drained in `catch` (ts), stacked `defer`
  compensations (go), handler-coordinated compensation (py).
- **TRANSFORM:** Run each step with `ctx.run`. On failure, run the undo inline in
  the `catch`/error branch, guarded by which steps actually completed. No
  compensation stack, no drain helper. Make compensations idempotent.
- **TEMPORAL SOURCE:** `samples-typescript/saga`, `samples-go/saga`,
  `samples-python/message_passing/waiting_for_handlers_and_compensation`.
- **RESONATE TARGET:** `example-saga-booking-ts`, `example-money-transfer-{py,rs}`.
- **COVERAGE:** ts ✅ py ✅ rs ✅ go ⚠️ (no Go example yet — map by analogy).

## Pattern: Long-running loops

- **DETECT:** `continueAsNew` (ts), `workflow.NewContinueAsNewError` (go),
  `workflow.continue_as_new` (py).
- **TRANSFORM:**
  - Bounded loop → plain `while`/`for` with `ctx.run` + `ctx.sleep`. No
    `continueAsNew` equivalent needed.
  - **Truly unbounded loop → `ctx.detached(self, n+1)` tail-recursion**, split
    *inside* the per-iteration function. A naive infinite loop in a single durable
    invocation accumulates child promises that get re-walked on replay; once
    replay exceeds the task lease, cadence collapses. Do not emit a naive
    `while(true)` for genuinely infinite loops.
- **TEMPORAL SOURCE:** `samples-typescript/continue-as-new`,
  `samples-go/child-workflow-continue-as-new`,
  `samples-python/hello/hello_continue_as_new.py`.
- **RESONATE TARGET:** `example-infinite-workflow-{ts,go}`.
- **COVERAGE:** ts ✅ go ✅ py ⚠️ rs ⚠️ (no py/rs example yet — map by analogy).

## Pattern: Distributed mutex (TypeScript only)

- **DETECT:** a lock-manager workflow with a signal queue, `uuid4()` release
  tokens, and `continueAsNew`.
- **TRANSFORM:** Delete the lock machinery. Sequential `yield* ctx.run()` calls in
  a generator are serialized by the runtime — the generator is the lock. No
  signals, no tokens, no deadlock surface.
- **TEMPORAL SOURCE:** `samples-typescript/mutex`.
- **RESONATE TARGET:** `example-distributed-mutex-ts`.
- **COVERAGE:** ts ✅ (TypeScript only).

## Pattern: Encryption (TypeScript only)

- **DETECT:** a `PayloadCodec` (`encode`/`decode` over `Payload[]`) + custom
  `DataConverter` + codec server.
- **TRANSFORM:** Replace with a single `Encryptor` (`encrypt(Value): Value` /
  `decrypt(Value): Value`) passed as a constructor option:
  `new Resonate({ encryptor })`. Workflow code is unchanged; the SDK handles
  promise-store serialization.
- **TEMPORAL SOURCE:** `samples-typescript/encryption`.
- **RESONATE TARGET:** `example-encryption-ts`.
- **COVERAGE:** ts ✅ (TypeScript only).

---

## Coverage gaps (do not fabricate)

- Saga: no Go example (`example-saga-booking-go` / `example-money-transfer-go`).
- Long-running loops: no Python or Rust example (`example-infinite-workflow-py` / `-rs`).
- Distributed mutex, Encryption: TypeScript only.
- Rust source: Temporal has no Rust SDK — migrate Rust targets from the Temporal
  TypeScript idiom.

## Source of truth

- Resonate examples: https://github.com/resonatehq-examples
- Temporal samples: https://github.com/temporalio (`samples-typescript`, `samples-python`, `samples-go`)
- Conceptual guide: https://docs.resonatehq.io/evaluate/coming-from/temporal
