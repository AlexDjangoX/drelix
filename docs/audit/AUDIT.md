# React Component-by-Component Audit

A **reusable audit program** for reviewing React components and hooks in any codebase. Based on the [React documentation](https://react.dev) (reference and Learn). Use it route-by-route or feature-by-feature and record findings in the Audit Trail at the end.

---

## Before you start: Vercel / Next.js best practices

**Use the Vercel React best practices first** (plugin or rule set) so macro concerns are already in place before this component-level audit.

1. **Enable the Vercel plugin / rule set**
   - **Plugin:** In your IDE or CI, enable the [Vercel React best practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) (e.g. Cursor/Vercel integration or the rule file from that repo).
   - **Rule set:** The full list (57 rules, 8 categories) is in [AGENTS.md](https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/react-best-practices/AGENTS.md). Use it in your project’s agent/audit docs or CI.

2. **What it covers (do this before the checklists below)**
   - **Eliminating waterfalls** — `Promise.all()` for independent work, defer `await`, Suspense.
   - **Bundle size** — Avoid barrel imports, use dynamic imports where appropriate, defer analytics.
   - **Server-side performance** — Auth in Server Actions, `React.cache()`, minimal RSC payload.
   - **Client data fetching** — Prefer framework/RSC/data lib; SWR-style patterns; minimal localStorage.
   - **Re-render and rendering performance** — Covered in part by this audit (useMemo, derived state); the plugin adds more patterns.

3. **Why first**  
   This audit focuses on **hooks and component-level correctness** (Rules of Hooks, useEffect, state vs derived, cleanup). It does **not** re-audit data-fetching strategy, bundle boundaries, or server/client split. Apply Vercel best practices so those are already addressed; then run this audit for per-component, per-hook correctness.

---

## 1. Scope and Objectives

### In scope

- **Every client component** (files with `'use client'` or that use hooks) and **every custom hook** (functions whose names start with `use`).
- **Focus:** Rules of Hooks, `useEffect` (necessity, dependencies, cleanup), state vs derived data, `useCallback`/`useMemo`, custom hook correctness.

### Out of scope

- Server Components (no hooks), API routes, non-React code.
- Macro concerns (bundle size, data-fetching strategy, auth flows) unless they touch hook usage.

### References

- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [useEffect](https://react.dev/reference/react/useEffect)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [useCallback](https://react.dev/reference/react/useCallback)
- [useMemo](https://react.dev/reference/react/useMemo)

---

## 2. Execution Model

- **Unit of work:** One **file** that exports at least one React component or custom hook. Audit in a consistent order (e.g. by route or feature).
- **Per file:** Identify components/hooks → run checklists A–G (H optional) → record pass/fail and location → fix or defer with rationale.
- **Severity:** **Critical** (Rules of Hooks or wrong behavior) → **High** (unnecessary effect, missing cleanup) → **Medium** (missing memoization where it clearly helps) → **Low** (style/clarity).

---

## 3. Checklist A: Rules of Hooks

For every component and every custom hook:

| #   | Check                             | Pass criteria                                                             |
| --- | --------------------------------- | ------------------------------------------------------------------------- |
| A1  | Top-level only                    | No hook inside loops, conditions, nested functions, or try/catch/finally. |
| A2  | No hooks after early return       | All hooks run before any conditional `return`.                            |
| A3  | Not in event handlers             | No hook inside onClick, onChange, etc.                                    |
| A4  | Not inside other hooks’ callbacks | No hook inside a callback passed to useMemo, useReducer, useEffect.       |
| A5  | Only from React functions         | Hooks only in function components or in functions named `use*`.           |

**Tooling:** `eslint-plugin-react-hooks` (rules-of-hooks, exhaustive-deps). Fix all violations.

---

## 4. Checklist B: useEffect — When to Use

For every `useEffect`:

| #   | Check                         | Pass criteria                                                                                                                                                     |
| --- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | External system?              | Effect syncs with something _outside_ React (browser API, subscription, network, DOM, timers). If it only updates state from other props/state, remove or rework. |
| B2  | Not “transform for render”    | No effect that only sets state from props/state for rendering. Use render-time computation or `useMemo`.                                                          |
| B3  | Not “reset when prop changes” | No effect that only resets state when a prop (e.g. id) changes. Prefer `key={id}` or adjust during render.                                                        |
| B4  | Not for user events           | User-triggered side effects (submit, click) live in event handlers.                                                                                               |
| B5  | Event vs effect               | Direct response to user action → handler. Must run when on screen / when data is available → effect.                                                              |

If the effect is unnecessary per B1–B5, remove it and use event handler, derived value, or `key`. Otherwise continue to C and D.

---

## 5. Checklist C: useEffect — Dependencies

For every remaining `useEffect`:

| #   | Check                       | Pass criteria                                                                                                         |
| --- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| C1  | All reactive values in deps | Every prop/state read inside the effect (or cleanup) is in the dependency array. No missing-dependency warnings.      |
| C2  | No noise in deps            | No stable refs/context in deps just to satisfy lint; no inline object/function literals that force re-run every time. |
| C3  | Intent matches behavior     | `[]` = once after mount; `[a,b]` = when a or b change. Matches intent.                                                |
| C4  | Refs omitted on purpose     | If `ref.current` is read but ref not in deps, that’s intentional; document if non-obvious.                            |

Fix dependency arrays or refactor. Suppress only with a documented exception.

---

## 6. Checklist D: useEffect — Cleanup

For every effect that touches an external system:

| #   | Check                 | Pass criteria                                                          |
| --- | --------------------- | ---------------------------------------------------------------------- |
| D1  | Subscriptions         | addEventListener → removeEventListener; subscribe → unsubscribe; etc.  |
| D2  | Timers                | setTimeout/setInterval/requestAnimationFrame cleared in cleanup.       |
| D3  | Other resources       | Third-party instances, observers torn down in cleanup.                 |
| D4  | Strict Mode safe      | Setup → cleanup → setup behaves correctly; no double-connect or leaks. |
| D5  | Cleanup matches setup | Cleanup closes over what setup opened; no wrong resource disconnected. |

Add missing cleanup; verify under Strict Mode.

---

## 7. Checklist E: State and Derived Data

For every component (and stateful hook):

| #   | Check                          | Pass criteria                                                                                      |
| --- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| E1  | No redundant state             | Nothing stored in state that can be computed from existing props/state.                            |
| E2  | Derived data not in effects    | Filtered/sorted/derived lists computed in render or with useMemo, not via useEffect.               |
| E3  | Minimal state                  | State is the minimum needed; the rest is derived.                                                  |
| E4  | Reset via key when appropriate | When a different “entity” (e.g. id) should reset local state, use `key={id}` instead of an effect. |

Remove redundant state and “sync state from props” effects; use derivation or `key`.

---

## 8. Checklist F: useMemo and useCallback

For every component:

| #   | Check                               | Pass criteria                                                                                                          |
| --- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| F1  | Expensive calculations              | Non-trivial computations from props/state in useMemo with correct deps, or intentionally omitted.                      |
| F2  | useCallback where stability matters | Functions passed to memoized children or used in effect deps wrapped in useCallback with correct deps when it matters. |
| F3  | No over-memoization                 | No useMemo/useCallback on cheap work or where stability isn’t needed.                                                  |
| F4  | Dependencies correct                | All reactive values in useMemo/useCallback are in their dependency arrays.                                             |

Add memoization only where deps are correct and there’s a clear benefit.

---

## 9. Checklist G: Custom Hooks

For every custom hook (name starts with `use`):

| #   | Check                         | Pass criteria                                                                                          |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| G1  | Only from components or hooks | Never called from a plain function, class, or event handler.                                           |
| G2  | Correct dependency arrays     | Effects (and other hooks) inside the hook have correct deps; hook params used in effects are included. |
| G3  | Return contract clear         | Return value stability (or “new every time”) is documented if callers rely on it.                      |
| G4  | No conditional hooks          | All hooks at top level; no hooks in conditions or loops.                                               |
| G5  | Clear responsibility          | Single, clear purpose; split if it improves clarity and dependency clarity.                            |

---

## 10. Checklist H: Re-renders (Optional)

Apply when a component is slow (profiling or user feedback):

| #   | Check             | Pass criteria                                                                                             |
| --- | ----------------- | --------------------------------------------------------------------------------------------------------- |
| H1  | Memoized children | If a child is memo’d, object/function props are stable (useCallback/useMemo) or re-render is intentional. |
| H2  | Context           | Components re-render only when consumed context value changes; no unnecessary provider churn.             |
| H3  | Heavy render work | No very expensive work in render without useMemo; large lists consider virtualization.                    |

---

## 11. Quick Reference: “Should This Be an Effect?”

| Goal                                                 | Use effect? | Prefer instead                                              |
| ---------------------------------------------------- | ----------- | ----------------------------------------------------------- |
| Update state when props/state change (for rendering) | No          | Compute in render or useMemo                                |
| Reset state when prop (e.g. id) changes              | No          | key={id} on owning component                                |
| React to user action (click, submit)                 | No          | Event handler                                               |
| Fetch on mount / query change                        | Depends     | Prefer framework/RSC/data lib; if effect, add abort cleanup |
| Subscribe to external system                         | Yes         | useEffect + cleanup                                         |
| Animation / imperative API on mount or deps          | Yes         | useEffect + cleanup                                         |
| Sync with non-React widget                           | Yes         | useEffect + cleanup                                         |

---

## 12. How to Run the Audit

### Phase 1: Inventory

1. List files with `'use client'` or hooks (useState, useEffect, useContext, useCallback, useMemo, useRef, use\*).
2. Per file: list exported/local components and custom hook names.
3. Optionally tag by feature or route.

### Phase 2: Automated

1. Run ESLint (react-hooks rules); fix violations.
2. Grep for: setState in useEffect; empty effect deps; addEventListener without removeEventListener; setTimeout/setInterval without clear in cleanup.

### Phase 3: Per-file review

For each file: run checklists A → B → C → D → E → F → G (and H if needed). Record: File X — A pass, B 1 finding, C pass, …

### Phase 4: Fix and re-verify

1. Fix Critical and High first; document deferred.
2. Re-run lint and tests.
3. Re-run grep if useful.

### Phase 5: Document and repeat

1. Note last audit date and scope in this doc.
2. Add automated checks to CI.
3. Schedule next audit (e.g. before releases or quarterly).

---

## 13. Fix Patterns (recommended)

- **Sync state from props:** Prefer single source (use props, or derive with useMemo). If you must sync into a store, treat as “hydrate from server” and document; avoid redundant local state.
- **Reset state when prop (e.g. id) changes:** Use **key={prop}** on the component so it remounts; avoid an effect that sets state from the prop.
- **setState in effect (lint/React Compiler):** Remove the effect and use the patterns above, or **defer** setState (e.g. setTimeout(..., 0) with cleanup).
- **useEffect deps:** Include all reactive values; wrap callbacks in useCallback with correct deps when they’re in effect deps; avoid “missing dependency” without a documented exception.
- **Cleanup:** Timers, subscriptions, AbortController — clear in effect cleanup.

---

## Audit Trail Index

**Audited to date:** Phase 1–2 complete (inventory + automated). Per-file review started: Admin (EditProductModal, ImageUploadCell).

| Route / Feature | Entry (page or root) | Section | Notes |
| --------------- | -------------------- | ------- | ----- |
| Inventory + automated | — | §1 | Phase 1 inventory (see `docs/audit/INVENTORY.md`), Phase 2 ESLint + grep |

---

## §1. Phase 1–2: Inventory and Automated Checks

### Scope

- **Phase 1:** All client files and custom hooks (see `docs/audit/INVENTORY.md`). 54 client files, 6 custom hooks.
- **Phase 2:** ESLint (react-hooks + project config), grep for setState-in-effect, empty deps, addEventListener/removeEventListener, setTimeout/setInterval cleanup.

### Findings Fixed

| File | Checklist | Finding | Fix |
|------|------------|---------|-----|
| EditProductModal.tsx | C1 | useEffect missing dependency `sourceRow` | Added `sourceRow` to dependency array (replaced `productItem, row` for reset logic). |
| ImageUploadCell.tsx | — | Unused variable `hasImages` | Removed unused `hasImages` declaration. |

### Findings Noted (no change / deferred)

| File | Checklist | Note |
|------|-----------|------|
| EditProductModal.tsx | F / lib | `form.watch("categorySlug")` triggers react-hooks/incompatible-library (React Hook Form). Documented; no code change. Consider `useWatch` or lifting slug to state if memoization needed. |

### Phase 2 automated results

- **addEventListener:** ProductLightbox, useNavbarScroll — both have matching `removeEventListener` in cleanup. ✓
- **setTimeout:** LunaMascot — `setTimeout` cleared in cleanup with `clearTimeout(t)`. ✓
- **IntersectionObserver:** ContactMap — cleanup returns `observer.disconnect()`. ✓
- **Empty effect deps:** No problematic empty `[]` found; intentional mount-only effects documented (keydown, scroll, body overflow, blob URL cleanup, hydration).

### ESLint after fixes

- **Errors:** 0.
- **Warnings (deferred):** 1 — `react-hooks/incompatible-library` for `form.watch()` in EditProductModal (see above).

### Checklist summary

- **A (Rules of Hooks):** No violations reported by ESLint.
- **B (useEffect necessity):** To be reviewed per file in Phase 3.
- **C (useEffect deps):** One fix (EditProductModal); rest to be reviewed.
- **D (Cleanup):** Grep + spot check — listeners, timer, observer have cleanup.
- **E (State vs derived):** Deferred to per-file review.
- **F (useMemo/useCallback):** Deferred to per-file review.
- **G (Custom hooks):** Deferred to per-file review.

---

_Copy the “§\_N_. _Route / Feature Name_ Audit” block for each route or feature you audit, increment the section number, and add a row to the Audit Trail Index.\_
