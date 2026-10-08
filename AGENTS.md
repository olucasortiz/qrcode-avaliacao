# Frontend Design & Engineering Standards

## Mission
Build distinctive, premium, accessible, responsive frontend experiences. Aim for restrained minimalism combined with purposeful creativity and polished motion. Never default to a generic AI-generated SaaS aesthetic.

## Scope and precedence
- Apply these standards to frontend work in this repository, regardless of framework.
- Follow explicit product requirements, existing architecture, and established brand guidelines first. Do not redesign unrelated screens without permission.
- Adapt visual identity to each project. Do not impose a fixed light/dark theme, color palette, font, or layout.
- For backend-only tasks, do not introduce frontend changes.

## Before implementation: understand and propose
1. Inspect existing routes, components, styling, dependencies, assets, and design conventions.
2. Identify target users, primary workflows, content hierarchy, and constraints.
3. For a new product or substantial redesign, propose a concise direction: visual personality, palette, typography, layout approach, motion approach, and mobile navigation. State assumptions when requirements are missing.
4. Reuse existing patterns when appropriate. Ask for approval before a substantial visual overhaul; for small scoped tasks, proceed consistently with the established system.
5. If references are supplied, extract principles rather than copying screens or brand assets.

## Visual direction
- Favor clear hierarchy, intentional whitespace, strong typography, careful alignment, and coherent spacing.
- Use an intentional and limited palette with accessible contrast. Choose light, dark, or mixed themes based on product context.
- Avoid formulaic hero sections, gratuitous gradients, repetitive stat cards, indiscriminate glassmorphism, oversized radii, and decorative icon overload.
- Do not ban cards, gradients, shadows, or sidebars categorically: use them only when they solve a real information or interaction problem.
- Prefer content-specific composition over repeating the same layout for every page.
- Use consistent design tokens for colors, typography, spacing, radii, borders, elevation, and motion.
- Use real supplied copy and assets. If unavailable, clearly label placeholders; do not invent testimonials, customer logos, metrics, or claims.

## Motion and interaction
- Motion must clarify state, hierarchy, navigation, or feedback—not merely decorate.
- Provide polished hover, focus, pressed, loading, success, error, and transition states where applicable.
- Prefer lightweight CSS transitions for simple interactions; add a motion library only when complexity justifies it.
- Animate transform and opacity when practical; avoid costly layout animation and excessive simultaneous effects.
- Use varied, restrained choreography rather than identical fade-ins everywhere.
- Support `prefers-reduced-motion` with minimal or disabled nonessential animation.
- Do not hide essential content behind scroll effects or delay critical actions.

## Responsive behavior
- Design mobile-first, then adapt composition deliberately for tablet and desktop.
- Test representative widths around 360, 768, 1024, and 1440 CSS pixels when tools are available; adjust breakpoints based on content rather than devices alone.
- Ensure no unintended horizontal scrolling, clipping, overlapping controls, or unreadable typography.
- Adapt navigation, tables, charts, forms, dialogs, and touch targets rather than simply shrinking desktop layouts.
- Ensure keyboard usability, visible focus indicators, sensible tab order, semantic HTML, and appropriate labels.

## Engineering quality
- Respect the project's framework, code conventions, routing, state management, and build tooling.
- Build reusable components where repetition is real, without premature abstraction.
- Keep dependencies lean. Do not add animation or component packages without a clear reason.
- Maintain accessible color contrast and readable type; consider WCAG 2.2 AA as the target when feasible.
- Handle empty, loading, error, success, disabled, and validation states.
- Optimize images, fonts, and animations; avoid unnecessary layout shifts and expensive effects.
- Keep visual polish from compromising usability, data accuracy, security, or performance.

## Workflow and acceptance criteria
1. Inspect the existing implementation and define the scope.
2. Establish or confirm a small design system and interaction principles.
3. Implement the requested flow end-to-end, including responsive and interaction states.
4. Run available lint, type checks, tests, and build; report what ran and what did not.
5. When browser/screenshot tools are available, visually inspect desktop and mobile states and fix concrete defects. Never claim visual testing if it was not performed.
6. Review for generic patterns: repetitive cards, default-looking layouts, weak hierarchy, inconsistent spacing, gratuitous effects, and mismatched mobile behavior.
7. Summarize design decisions, files changed, checks performed, limitations, and any follow-up items.

## Definition of done
- The result has a project-specific identity and consistent design tokens.
- Key tasks are clear, usable, and accessible across screen sizes.
- Motion is smooth, purposeful, and respects reduced-motion preferences.
- States and edge cases are handled.
- Existing functionality is preserved unless changes were requested.
- Quality checks and visual inspection are completed where tools permit, with limitations disclosed.
