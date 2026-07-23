/**
 * Node globals are provided by @types/node through tsconfig.api.json.
 *
 * Keep this module as an explicit marker for the API type environment, but do
 * not redeclare `process` with a reduced shape. A narrow declaration hides
 * standard Node members such as cwd(), on(), versions and release from every
 * serverless function during TypeScript validation.
 */
export {}
