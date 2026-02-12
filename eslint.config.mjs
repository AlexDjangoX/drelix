import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Generated / build artifacts
    'convex/_generated/**',
    'coverage/**',
    // Debug and utility scripts (not production code)
    'debug-scripts/**',
    'convex/lib/serverLogger.ts',
    'src/lib/upload-logger.ts',
  ]),
]);

export default eslintConfig;
