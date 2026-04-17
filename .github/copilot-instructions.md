# MaqAgr - GitHub Copilot Instructions

You are an expert AI programming assistant working on **MaqAgr**, a web-based decision support system for agricultural mechanization developed by the **Devurity** research group.

## Tech Stack

- **Frontend**: React 19 (SPA) with Vite 6.
- **Routing**: React Router 7 (`react-router-dom`).
- **Styling**: Tailwind CSS 4 with `shadcn/ui` (custom adaptation).
- **Communication**: Native `fetch` with a dual Mock/Remote API pattern.
- **Icons**: `lucide-react` and `react-icons`.
- **State/Logic**: Functional components with hooks; `"use client"` directive where necessary.

## Architecture & Conventions

1. **API Service Pattern**:
   - Centralized logic in `src/services/tractorApi.js`.
   - Toggle behavior via `VITE_ENABLE_REMOTE_TRACTOR_API`.
   - **Requirement**: Always implement mock fallback logic alongside remote API calls.
2. **File Naming**:
   - **Pages & Components**: `PascalCase.jsx` (e.g., `TractorList.jsx`, `Home.jsx`).
   - **Services & Utils**: `camelCase.js` (e.g., `tractorApi.js`).
3. **Testing**:
   - Use Node.js built-in test runner (`node:test`).
   - **Always destructure** specific assert functions:
     ```js
     import { ok, strictEqual, deepStrictEqual } from "node:assert/strict";
     ```
   - Avoid using the default `assert` object.
4. **Dependencies & Supply Chain**:
   - **Never use `^` or `~`** in dependency version specifiers. Always pin exact versions in `package.json`.
   - **Always commit the lockfile** (`package-lock.json`).
   - Use deterministic installs: `npm ci` or `npm install --ignore-scripts`.

## Domain & Code Style

- **Agricultural Domain**: Respect entities like Tractors, Implementos, and Soils.
- **Language**: UI is in **Spanish**, but code (variables, functions, filenames) must be in **English** (e.g., `calculateTractionForce`, not `calcularFuerzaTraccion`).
- **Case Sensitivity**: Explicitly ensure imports match filenames exactly. Vercel deployment (Linux) will fail on case mismatches that pass on Windows.
- **JSDoc**: Annotate all service functions and complex components with JSDoc for better intellisense and documentation.
- **Modularization**: Keep components under `src/components/ui/` (base) or feature-specific folders. Avoid large monolithic files.
- **Environment**: Access variables via `import.meta.env`. Prefix with `VITE_`.

## Integration with Backend

- **STRICT Data Mapping (Casing)**: The Express backend strictly expects and returns JSON in `snake_case` (e.g., `engine_power_hp`). The React frontend operates entirely in `camelCase` (e.g., `enginePowerHp`). **Any Fetch request (GET/POST/PUT) MUST apply explicit translation/mapping mappings before rendering UI and before sending payloads to the backend.**
- **REST API**:
  - **Data Mapping (Casing)**: The Express backend returns JSON in `snake_case` (e.g., `engine_power_hp`, `soil_type`). Frontend services must map these to `camelCase` (e.g., `enginePowerHp`, `soilType`) before passing data to UI components, and vice versa for POST/PUT payloads.
  - **Authentication**: The backend uses JWT. API interceptors or native `fetch` wrappers (e.g., in `lib/utils.js`) must automatically inject the `Authorization: Bearer <TOKEN>` header extracted from the auth state.
  - **Error Handling**: The backend standardizes errors (e.g., 400, 401, 403, 404, 500). The frontend must catch these native `fetch` HTTP errors (checking `!response.ok`), parse the backend's error message, and translate it into a friendly Spanish message for the UI alerts.
  - **Roles**: Understand the 3 system roles: `admin`, `user`, and `operator` for RBAC rendering in the UI.
