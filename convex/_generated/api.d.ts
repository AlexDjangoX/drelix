/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as catalog from "../catalog.js";
import type * as crons from "../crons.js";
import type * as lib_authHelpers from "../lib/authHelpers.js";
import type * as lib_constants from "../lib/constants.js";
import type * as lib_convexAuth from "../lib/convexAuth.js";
import type * as lib_errorMessages from "../lib/errorMessages.js";
import type * as lib_helpers from "../lib/helpers.js";
import type * as lib_index from "../lib/index.js";
import type * as lib_serverLogger from "../lib/serverLogger.js";
import type * as lib_types from "../lib/types.js";
import type * as lib_validators from "../lib/validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  catalog: typeof catalog;
  crons: typeof crons;
  "lib/authHelpers": typeof lib_authHelpers;
  "lib/constants": typeof lib_constants;
  "lib/convexAuth": typeof lib_convexAuth;
  "lib/errorMessages": typeof lib_errorMessages;
  "lib/helpers": typeof lib_helpers;
  "lib/index": typeof lib_index;
  "lib/serverLogger": typeof lib_serverLogger;
  "lib/types": typeof lib_types;
  "lib/validators": typeof lib_validators;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
