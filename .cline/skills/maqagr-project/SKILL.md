---
name: maqagr-project
description: Provide project-specific guidance for MaqAgr (Agricultural Machinery Decision Support). Use when working on this repository's SPA architecture, tractor API integration, component standards, or agricultural domain logic.
---

# MaqAgr Project Guidance

Apply these repository conventions when working on the MaqAgr (Mecanización Agrícola) codebase.

## Project Context
MaqAgr is a Single Page Application (SPA) designed to support decision-making in agricultural mechanization. It is a research project from the **Surcolombiana University (Semillero Devurity)**.

### Agricultural Domain
- **Key entities**: Tractors (id, brand, model, power in HP, weight in kg, traction type).
- **Calculations**: Traction force, tire pressure, and equipment compatibility.
- **Terminology**: Use Spanish for public-facing UI, but code (variables, files) should remain in English (e.g., `tractor_id`, `engine_power_hp`).

## UI Stack and Architecture
- **Core**: React 19 (SPA) + Vite 6 + Tailwind CSS 4.
- **Routing**: React Router 7 (`react-router-dom`).
- **Components**: PascalCase (e.g., `TractorForm.jsx`).
  - Base UI components are in `src/components/ui/` (shadcn adaptation).
  - Layout components (Header, Footer) are in `src/components/layout/`.
  - Feature pages are in `src/pages/`.
- **Hooks**: Use `"use client"` only when hooks, browser APIs, or client state are required.
- **Styling**: Prefer Tailwind CSS 4 utility classes. Use `clsx` and `tailwind-merge` for conditional classes.

## API Integration Pattern & Glossary
The project communicates with an Express/PostgreSQL backend located securely via `VITE_API_BASE_URL`.

> **Note (.backend Context)**: Any local folder named `.backend` (including its `/docs` & `/out` subfolders) is strictly **READ-ONLY** for LLM agents. Never edit files inside `.backend` or allow them to influence the frontend's global repository configurations. This folder exists solely to provide context on backend business logic and documentation, and should only be accessed when explicitly requested by the user.

- **API Glossary**: 
  - `Tractors` and `Implements`: Public and Admin CRUD.
  - `Terrains`: Private, scoped solely per authenticated User.
  - `Calculations/Recommendations`: The core protected Physics Engine (JWT required).
- **Dual Mode Feature Flag**: Services like `tractorApi.js` use `VITE_ENABLE_REMOTE_TRACTOR_API` to toggle between Mock and Remote modes.
- **Mock Mode latency**: Local array `mockTractors` persists in-memory. **Must always include a realistic fake latency (`setTimeout`)** mimicking remote networks.
- **Remote Mode Requirements**: You must apply strict translation from backend `snake_case` (DB) to frontend `camelCase` (React properties) and ensure Vercel `vercel.json` rewrites and proxy alignments are respected.
- **Rule**: ALWAYS implement both mock and remote logic in services to allow frontend-only development.

## Security, Roles and Error Handling
- **Auth**: Custom JWT-based authentication. Token is stored in `localStorage` (`token` or `authToken`). Fetch wrappers must automatically inject `Authorization: Bearer <TOKEN>`.
- **Roles**: Understand the 3 system roles: `admin`, `user`, and `operator` for RBAC rendering in the UI.
- **Error Handling**: The frontend must catch native `fetch` HTTP errors (e.g. `!response.ok`), parse the backend message, and translate it to friendly Spanish for UI alerts.
- **Validation**: Sanitize user input before sending to `tractorApi`. Use `JSDoc` to document data structures and requirements.
- **Integrity**: Reuse existing auth utilities in `src/components/auth/` and API request helpers in `services/`.

## Testing Conventions
- **Runner**: Node.js built-in test runner.
- **Assertion style**: NEVER use `assert.ok()`. **ALWAYS destructure** specific functions.
  ```javascript
  import { ok, strictEqual } from "node:assert/strict";
  ```
- **Helpers**: Use shared helpers from `tests/helpers.mjs` for setup/teardown.

## Dependencies & Supply Chain
- **Pins**: Never use `^` or `~`. Pin exact versions in `package.json` for deterministic builds.
- **Lockfile**: Always keep `pnpm-lock.yaml` committed. Use deterministic installs (`pnpm install --frozen-lockfile`).
- **NPM IS FORBIDDEN**: This project exclusively uses pnpm (>=11.1.0). Never supply or run npm commands.
- **Linting**: Run `pnpm run lint` before committing.
- **Deployment**: Targeted for Vercel. Ensure `vercel.json` and `vite.config.js` headers/rewrites are maintained.

## Code Style
- **Naming**: 
  - Pages: `PascalCase.jsx`
  - Components: `PascalCase.jsx`
  - Services: `camelCase.js`
- **Case Sensitivity**: Vercel (Linux) is case-sensitive. Filenames and import statements must match EXACTLY.
- **JSDoc**: Maintain extensive JSDoc for modules, especially in `services/` and domain complex logic.
