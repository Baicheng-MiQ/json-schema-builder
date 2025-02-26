/**
 * Returns an array of paths to include in your Tailwind content configuration
 * to ensure all styles from json-schema-canvas are properly processed.
 * 
 * Usage in your tailwind.config.js/ts:
 * ```
 * import { tailwindContent } from 'json-schema-canvas';
 * 
 * export default {
 *   content: [
 *     './src/**//*.{js,ts,jsx,tsx}',
 *     ...tailwindContent()
 *   ],
 *   // rest of your config
 * }
 * ```
 */
export function tailwindContent() {
  return [
    "./node_modules/json-schema-canvas/dist/**/*.{js,cjs}",
  ];
}