# Specification

## Summary
**Goal:** Make the existing app fully functional end-to-end by fixing backend/UI integration across all modules, and implement a “Live Chat” Community experience with staff moderation, rules-based permissions, and 1-second polling updates.

**Planned changes:**
- Remove placeholder/“backend pending” states by wiring every existing module screen’s primary actions to working Motoko backend endpoints (Renewal Reminders, Savings Coach, Membership Checker, Wellbeing & Fitness, Meal Planning, Shopping Lists, Achievements, Community) and ensure create/update/list/delete flows persist where applicable.
- Improve error handling so backend traps/unexpected errors are not surfaced raw in the UI; show clear English user-facing messages.
- Add/extend React Query hooks for implemented endpoints, including proper invalidate/refetch after mutations.
- Implement Community “Live Chat” end-to-end with 1-second frontend polling for automatic updates:
  - Global chat (send/list).
  - Private messages (conversation threads).
- Add message flagging and staff moderation:
  - Users can flag messages (including private messages).
  - Staff-only UI to review flagged items with enough context.
  - Staff can delete messages from relevant chats.
  - Enforce staff-only access to moderation features.
- Add private messaging controls and permission rules:
  - Conversation pause/unpause that prevents the other participant from sending while paused (backend-enforced).
  - Block non-staff users from privately messaging staff (UI + backend).
  - Allow staff-to-staff private messaging.
  - Support one-way staff-to-user threads where users can read but cannot reply (UI + backend).
- Add group chats with 1-second polling:
  - Hidden staff-only group chat (staff-only access; staff message deletion).
  - Household group chat scoped to household membership (flagging enabled; clear empty state for users not in a household).
- Update Community/chat UI and new staff moderation views with a consistent theme aligned to the existing Tailwind/Shadcn system, supporting light/dark mode, and avoiding a blue+purple primary palette.

**User-visible outcome:** All existing module screens work without “backend not connected” placeholders, and the Community module provides live-updating global, private, staff-only, and household chats with flagging, staff moderation/deletion, and enforced messaging rules (including pausing and one-way staff messages), styled consistently in light/dark mode.
