# 001: Add Tests, Typescript Setup

This step, we do the following:

1. Add Jest.
2. Add a `baseUrl` to Typescript.
3. Add a simple passing test.

## Why do these things?

Some of this setup is for the sake of getting tests going. Other parts are to ensure our imports can be done with absolute paths.

### Why bother with absolute paths?

Because it makes refactoring later, easier. It rewards us for thinking of internal dependencies as external packages. That means we can make that change later if we like - but even if we don't, it then rewards us for proper package discipline.

## Notable Errors

- Problem: "Cannot use Import statement outside a module"
- Resolution: Add babel config.
- Explanation: Jest does a lot for you, and it's a nice tool to work with, but unfortunately it leaks quite a lot of its architecture. Babel is one of those scenarios: in cases where your local build / setup varies a little from Jest's expectations, you'll have to reconfigure its internal babel dependencies so they continue to function. Unfortunately this is a pretty big flaw for a consumer-facing test runner, and it means that no one can fully go to production with Jest unless they also know about Babel.
