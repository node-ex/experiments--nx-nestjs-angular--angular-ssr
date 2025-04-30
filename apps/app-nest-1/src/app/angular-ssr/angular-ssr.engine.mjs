/**
 * ESM Bridge File for Angular SSR
 *
 * This file acts as an "ESM bridge" to allow CommonJS/TypeScript (NestJS) code to use ESM-only modules from @angular/ssr/node.
 *
 * Why is this needed?
 * - @angular/ssr/node is published as an ES Module (ESM), which cannot be directly required or statically imported from CommonJS (CJS) modules or some build setups (like Nx/NestJS with webpack).
 * - Attempting to import these ESM modules directly in CJS/TS code results in runtime errors (ERR_REQUIRE_ESM).
 *
 * How does this work?
 * - This file is written in pure ESM (.mjs extension).
 * - It imports the ESM-only exports and re-exports them via functions.
 * - The main NestJS app uses dynamic import() to load this file at runtime, bypassing CJS/ESM interop issues.
 *
 * Usage:
 * - Use `import('./angular-ssr.engine.mjs')` in your NestJS providers to access this file's exports.
 */

import {
  AngularNodeAppEngine,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

export function createAngularNodeAppEngine() {
  return new AngularNodeAppEngine();
}

export { writeResponseToNodeResponse };
