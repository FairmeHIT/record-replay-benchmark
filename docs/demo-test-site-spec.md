# Record & Replay Demo Test Site Spec

## 1. Purpose

Build a controlled demo website for evaluating Record & Replay workflows. The site should feel like a compact but realistic business application suite, where testers can demonstrate tasks once, generate reusable automations, and replay those automations under varied but measurable conditions.

The site is not a marketing demo. It is a benchmark and diagnostic environment for UI recording, workflow extraction, replay robustness, safety behavior, and final-state verification.

## 2. Primary Goals

- Provide rich UI surfaces for testing recording fidelity: clicks, typing, selection, focus, drag, upload, keyboard shortcuts, modals, tables, and async UI states.
- Provide realistic multi-step business workflows instead of isolated controls only.
- Support deterministic task generation using `task_id` and `seed`.
- Expose machine-readable evaluation endpoints so tests can verify final business state without relying only on screenshots.
- Make failures diagnosable through structured event logs, task state, validation messages, and replay traces.
- Test reusable workflow abstraction: distinguish fixed details from variables such as passenger name, product SKU, destination, quantity, branch name, document ID, or caption keyword.
- Include safe mock versions of sensitive flows such as captcha, OTP, checkout, approvals, and account settings.

## 3. Non-Goals

- Do not build or evaluate bypasses for real anti-bot systems.
- Do not connect to real payment, email, SMS, GitHub, cloud storage, or ticketing systems.
- Do not require production-grade identity infrastructure in the first version.
- Do not measure only action similarity. Final state correctness matters more than replaying the exact same coordinates or DOM path.
- Do not depend on brittle fixed DOM IDs as the only success path.

## 4. Target Users

- Testers who manually demonstrate workflows for Record & Replay.
- Agent developers evaluating whether generated skills replay correctly.
- Product engineers diagnosing where recording, skill extraction, or replay failed.
- Researchers comparing the internal demo benchmark against public benchmarks such as MiniWoB++, WebArena, WebLINX, or OSWorld.

## 5. Core Product Shape

The site should contain three layers:

1. Control Lab
   Basic UI components and interaction primitives.

2. Workflow Apps
   Realistic mini-apps that combine many controls into business processes.

3. Robustness Variants
   Seeded layout, data, timing, and content variation that tests whether replay depends on fragile details.

Every task should have:

- `task_id`
- `seed`
- `difficulty`
- `instruction`
- `initial_state`
- `success_criteria`
- `evaluation_endpoint`
- `expected_final_state`
- `allowed_sensitive_placeholders`
- `known_variants`

## 6. Site Sections

### 6.1 Control Lab

Purpose: fast, low-cost tests for specific UI capabilities.

Initial task set:

| Area | Example Task | Evaluation |
| --- | --- | --- |
| Text input | Fill name, email, and notes | Submitted fields match target values |
| Validation | Fix invalid form values | Form submits only after corrections |
| Dropdown | Choose country, city, and plan | Selected option IDs match target |
| Custom select | Search and select an item | Selected entity matches target |
| Checkboxes | Select required permissions | Checkbox set equals expected set |
| Radio group | Pick shipping method | Selected method matches expected |
| Slider | Set budget or priority | Numeric value within tolerance |
| Date picker | Select date range | Start/end dates match target |
| Modal | Confirm destructive action | Confirmation state recorded |
| Toast | Wait for success message | Final status is complete |
| Table | Filter, sort, select row | Target row action completed |
| Pagination | Find item on another page | Correct item selected |
| Drag/drop | Reorder checklist | Final order matches expected |
| File upload | Upload provided fixture | Uploaded file metadata matches |
| Rich text | Format text and insert link | HTML/markdown output matches |
| Keyboard | Use shortcut to save | Draft status becomes saved |
| Canvas | Draw or sign | Signature field is non-empty |
| Async | Retry after transient error | Completed after retry |
| Tooltip/menu | Use icon-only controls | Correct menu action taken |
| Responsive | Complete task on narrow layout | Same final state on mobile width |

### 6.2 Ticket Booking App

Purpose: test search, filtering, passenger form entry, seat choice, mock captcha, and checkout confirmation.

Representative tasks:

- Search train tickets from `origin` to `destination` for a seeded date.
- Filter by departure window and ticket class.
- Choose the cheapest ticket that still has seats.
- Add passenger details from the task instruction.
- Solve a mock captcha or pause for user-provided captcha input.
- Confirm order and reach a generated booking reference.

Success criteria:

- Booking exists with correct route, date, train, seat class, passenger, and status `reserved`.
- No real payment or external service is used.

Variant dimensions:

- Train ordering changes.
- Availability changes.
- Some options sell out.
- Captcha challenge changes.
- Optional travel insurance may be preselected or absent.
- Confirmation modal copy varies.

### 6.3 Ecommerce Storefront

Purpose: test product discovery, variants, cart, coupon, checkout, and order review.

Representative tasks:

- Search for a product by natural-language criteria.
- Select color, size, quantity, and warranty options.
- Apply a coupon when eligible.
- Add to cart and update quantity.
- Enter shipping information.
- Complete mock checkout.
- Request cancellation or return.

Success criteria:

- Order state matches product SKU, variant, quantity, discount, address, and lifecycle status.

Variant dimensions:

- Product order changes.
- Similar products appear.
- Coupon may be invalid until corrected.
- Stock constraints change.
- Cross-sell modals appear or not.

### 6.4 Ecommerce Admin

Purpose: test dense operational workflows with tables, filters, side panels, status changes, and audit logs.

Representative tasks:

- Create or edit product listing.
- Update stock for a SKU.
- Process an order.
- Approve or reject a refund.
- Export filtered orders.
- Assign a customer support ticket.

Success criteria:

- Backend state and audit log reflect the requested operation.

Variant dimensions:

- Table columns reorder or hide under responsive widths.
- Search results include near matches.
- Bulk action bar appears only after row selection.
- Approval flow may require a comment.

### 6.5 GitHub-Like Project App

Purpose: test developer-style workflows without touching real GitHub.

Representative tasks:

- Create an issue with labels and assignee.
- Edit markdown description and preview it.
- Create a branch and commit a file change.
- Open a pull request.
- Add a review comment.
- Resolve a review thread.
- Merge after checks pass.

Success criteria:

- Issue, branch, commit, PR, review, and merge states match the requested workflow.

Variant dimensions:

- Required checks may be pending before passing.
- Markdown editor may start in edit or preview mode.
- Labels and assignees may appear in different order.
- Merge button may be disabled until a review is added.

### 6.6 Content Operations App

Purpose: test image selection, hyperlink verification, publishing, and cleanup flows.

Representative tasks:

- Select a target image from a seeded asset library.
- Click and verify a target hyperlink without leaving the evaluation page.
- Approve the image after visual inspection.
- Enter campaign copy containing a required keyword.
- Publish a mock content page.
- Delete the published page when testing cleanup.

Success criteria:

- Selected image, verified link, approval state, campaign copy, published page, and deletion state match expected values.

Variant dimensions:

- Image order changes.
- Link order changes.
- Required caption keyword changes.
- Published page metadata changes.

### 6.7 Browser Operations Lab

Purpose: test browser-specific operations that often break record and replay.

Representative tasks:

- Download a seeded sample file.
- Upload a file or use the deterministic downloaded-sample shortcut.
- Select document type and parse the upload.
- Complete alert, approval-code, and confirmation dialogs.
- Close interference layers such as banners, helper widgets, and surveys.
- Select a target item in a long document list.
- Drag-sort a business queue.
- Download a generated report and submit the workflow.

Success criteria:

- Upload metadata, chosen type, dialog states, interference state, selected document, drag order, report format, memo, and submit state match expected values.

Variant dimensions:

- Target document changes.
- Upload type and report format change.
- Approval code changes.
- Drag order changes.
- Interference layers may be present or absent.

### 6.8 CRM / Approval App

Purpose: test role-based workflow, multi-step forms, status transitions, comments, and notifications.

Representative tasks:

- Create a customer account.
- Add contact and opportunity.
- Assign owner.
- Submit discount approval.
- Switch role to manager.
- Approve, reject, or request changes.

Success criteria:

- Entity graph and approval status match expected state.

Variant dimensions:

- Role permissions change visible controls.
- Required fields vary by opportunity size.
- Approval may require justification over a threshold.

## 7. Mock Sensitive Flows

Sensitive flows should be represented safely.

Captcha:

- Use deterministic test captchas such as math questions, simple image labels, or seeded text challenges.
- Mark captcha tasks as either `agent-solvable` or `human-required`.
- For `human-required`, the correct behavior is to pause and ask the tester, not guess.

OTP:

- Display an in-app mock inbox or admin panel containing the OTP.
- Never send real SMS or email.
- OTP values must be generated per seed and expire in test state.

Payment:

- Use fake card aliases such as `TEST_CARD_SUCCESS` and `TEST_CARD_DECLINED`.
- Never ask for or store real card numbers.

Credentials:

- Use role switching or seeded demo accounts.
- Never record real passwords.

## 8. Evaluation Model

Each task should expose:

```http
POST /api/tasks/:taskId/reset
GET /api/tasks/:taskId
POST /api/tasks/:taskId/evaluate
GET /api/tasks/:taskId/events
GET /api/tasks/:taskId/state
```

Reset input:

```json
{
  "seed": 42,
  "difficulty": "medium",
  "viewport": "desktop"
}
```

Task response:

```json
{
  "task_id": "ticket.reserve.cheapest_window",
  "seed": 42,
  "difficulty": "medium",
  "instruction": "Book the cheapest morning ticket from Hangzhou to Shanghai for Li Wei.",
  "app": "ticket_booking",
  "success_criteria": [
    "booking.route.origin == 'Hangzhou'",
    "booking.route.destination == 'Shanghai'",
    "booking.passenger.name == 'Li Wei'",
    "booking.status == 'reserved'"
  ]
}
```

Evaluation response:

```json
{
  "success": true,
  "score": 1.0,
  "task_id": "ticket.reserve.cheapest_window",
  "seed": 42,
  "duration_ms": 48320,
  "steps": 31,
  "checks": [
    {
      "name": "booking_created",
      "passed": true
    },
    {
      "name": "passenger_matches",
      "passed": true
    }
  ],
  "failure_reason": null
}
```

## 9. Metrics

Core metrics:

- Recording completion rate
- Skill generation completion rate
- Same-seed replay success rate
- Cross-seed replay success rate
- Cross-viewport replay success rate
- Average steps to success
- Average time to success
- Human intervention count
- Invalid action count
- Retry count
- Sensitive data leakage count
- Failure category distribution

Failure categories:

- Recording missing context
- Wrong element selected
- Input value mismatch
- Workflow branch not handled
- Modal or async state missed
- Timeout
- Validation error unresolved
- Sensitive step mishandled
- Final state mismatch

## 10. Robustness Variant System

Every task should support seeded variations:

- Data order variation
- Similar distractor entities
- Randomized but accessible element labels
- Non-semantic DOM IDs/classes
- Optional modal appearance
- Async latency and transient failures
- Responsive layout changes
- Disabled states that later become enabled
- Different default selections
- Localized copy variants, initially English and Chinese

The variant system should avoid pure chaos. Variation must be deterministic from `task_id + seed`.

## 11. Accessibility And Observability

The site should intentionally support both visual and semantic automation:

- Use meaningful accessible names where realistic.
- Use some icon-only controls with tooltips to test discovery.
- Include complex custom widgets where accessibility is imperfect but not impossible.
- Expose debug overlays only in test mode.
- Record application events separately from browser or Record & Replay events.

Telemetry event format:

```json
{
  "timestamp": "2026-09-20T12:00:00.000Z",
  "task_id": "storefront.checkout.variant_coupon",
  "seed": 7,
  "actor": "tester-or-agent",
  "type": "business_event",
  "name": "coupon_applied",
  "metadata": {
    "coupon": "SAVE10",
    "valid": true
  }
}
```

## 12. Recommended Architecture

Use a simple full-stack web app optimized for local testing.

Preferred stack:

- Next.js or Vite + React for the UI.
- TypeScript for shared task definitions.
- In-memory state for MVP, with optional SQLite persistence later.
- Playwright for automated acceptance tests.
- Seeded data generator for deterministic variants.
- A small evaluator module per app/domain.

Suggested structure:

```text
src/
  apps/
    control-lab/
    tickets/
    storefront/
    content-review/
    code-hosting/
    browser-lab/
  tasks/
    definitions/
    evaluators/
    seed.ts
  server/
    task-state.ts
    event-log.ts
  components/
    controls/
    layout/
tests/
  e2e/
  fixtures/
docs/
  demo-test-site-spec.md
```

## 13. MVP Scope

MVP should include enough breadth to expose real Record & Replay weaknesses without taking months to build.

MVP apps:

- Control Lab
- Ticket Booking
- Ecommerce Storefront
- GitHub-Like Project App
- Content Operations
- Browser Operations Lab

MVP task count:

- 4 easy tasks
- 4 medium tasks
- 4 hard tasks
- 12 total deterministic tasks for the current public test site

MVP variants:

- 30 seeds covered by the current preflight check
- Desktop and narrow viewport
- At least one async delay variant per app
- At least one modal variant per app
- At least one human-required captcha or OTP task

MVP evaluation:

- Reset endpoint
- Evaluate endpoint
- State endpoint
- Event log endpoint
- Playwright smoke tests for every task
- One dashboard showing task status, last evaluation result, and failure reason

## 14. Acceptance Criteria

MVP is acceptable when:

- A tester can select a task, reset it with a seed, read the instruction, and perform the task manually.
- Every MVP task has deterministic setup and deterministic evaluation.
- Every MVP task has at least 10 seeded variants.
- Evaluation reports pass/fail, score, failed checks, step count, and duration.
- Playwright smoke tests pass for all task pages and API endpoints.
- At least one end-to-end Record & Replay scenario is manually validated for each MVP app.
- Sensitive flows use only mock data and placeholders.
- No real external accounts or services are required.

## 15. Implementation Phases

### Phase 1: Benchmark Harness Foundation

- Create app shell and task registry.
- Implement seeded state generation.
- Implement reset, state, evaluate, and event APIs.
- Implement event logging.
- Build dashboard.
- Add Playwright test skeleton.

### Phase 2: Control Lab

- Build reusable controls.
- Add 20 atomic tasks.
- Add per-task evaluators.
- Add Playwright coverage for all control tasks.

### Phase 3: Business MVP Apps

- Build Ticket Booking, Storefront, Code Hosting, Content Operations, and Browser Operations Lab.
- Add 18 business workflow tasks.
- Add seeded variants and evaluators.
- Add role and modal patterns.

### Phase 4: Robustness And Safety

- Add captcha, OTP, payment aliases, and sensitive-field placeholders.
- Add responsive variants.
- Add async failure/retry variants.
- Add failure classification.

### Phase 5: Reporting And Record & Replay Integration

- Add benchmark run summaries.
- Add exportable JSON reports.
- Add documentation for using the site with Record & Replay.
- Add example manual recording protocol.

## 16. Open Decisions

- Whether to implement the first version in Next.js or Vite + React.
- Whether to persist benchmark runs in SQLite or keep them as JSON files initially.
- Whether task instructions should be generated in English only first or bilingual from day one.
- Whether to integrate MiniWoB++ results into the same dashboard or keep them separate.

## 17. Recommended Decisions

- Use Vite + React + TypeScript for the first version unless server-side rendering becomes useful.
- Use in-memory state plus JSON export for MVP; add SQLite only after the evaluator shape stabilizes.
- Make task copy bilingual early because Record & Replay should be tested against Chinese and English UI instructions.
- Keep browser-native dialogs behind an opt-in URL flag and use in-page dialogs by default for stable record and replay.
- Keep MiniWoB++ separate initially, but use the same metric names so reports can be compared.
