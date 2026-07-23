/**
 * Node globals are provided by @types/node through tsconfig.api.json.
 *
 * This file remains as an explicit marker for the API type environment, but it
 * must not redeclare `process` with a narrower shape because that hides standard
 * members such as cwd(), on() and versions from every serverless function.
 */
export {}
