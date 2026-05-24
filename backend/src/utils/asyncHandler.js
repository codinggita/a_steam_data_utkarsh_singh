/**
 * STEP 4 — asyncHandler.js
 *
 * Express route handlers are often `async (req, res) => { ... }`.
 * If an `async` function throws OR returns a rejected Promise, Express 4 does not
 * automatically send that to your error middleware unless you call `next(err)`.
 *
 * This tiny wrapper runs your async handler inside `Promise.resolve(...).catch(next)`
 * so ANY failure becomes `next(err)` — your global error handler can format one
 * consistent JSON error for the whole app.
 *
 * Without asyncHandler you would repeat try/catch in every controller:
 *
 *   exports.getThing = async (req, res, next) => {
 *     try {
 *       const thing = await Thing.find();
 *       res.json(thing);
 *     } catch (err) {
 *       next(err);
 *     }
 *   };
 *
 * With asyncHandler you write only the "happy path":
 *
 *   const asyncHandler = require('./asyncHandler');
 *   const myFunc = asyncHandler(async (req, res) => {
 *     const thing = await Thing.find(); // if this throws, next(err) runs automatically
 *     return res.json(thing);
 *   });
 */

/**
 * asyncHandler — higher-order function: it takes an async function and returns a normal Express handler.
 * @param {Function} fn — async (req, res, next) => { ... }  (next is optional but available)
 */
function asyncHandler(fn) {
  // Return a NEW function with signature (req, res, next) that Express understands.
  return function wrapped(req, res, next) {
    // Promise.resolve(...) turns whatever fn returns (a Promise or a value) into one Promise chain.
    Promise.resolve(fn(req, res, next))
      // .catch(next) forwards the error to Express; the 4-arg error middleware then runs.
      .catch(next);
  };
}

module.exports = asyncHandler;
