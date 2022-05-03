# 013: Watching it work

We've got a pretty cool setup. Let's check it out in the browser. A quick `yarn dev` and we're ready to go, and although it doesn't look very pretty it does work exactly as we'd expect.

Right up until we hit the submit button, and we see the error message, of course: "We encountered an error while registering". Uh oh. Did we miss something?

After a bit of quick checking, we realize that, no - we didn't miss anything, at least not technically speaking. There _is no registration endpoint_, and the app is just saying "Hey, no go". Fair enough. Still, we were sort of expecting to see "Registration success", and so - again, technically speaking - it wasn't quite correct.

## Mocking the network call

We've got MSW installed, so why not mock the network on the front end as well as in our test suite? It handles that pretty well, right.

Well, yes, and no.

MSW is a great tool, but if you dig into using it for development mocking, you'll find that it relies on service worker technology to function. Service workers, while awesome, only function in secure environments, which means that in order to get it running locally we'll have to implement some kind of local certificate setup. That's a lot. Surely more than we want to do right now.

What else can we do? Well, what's stopping us from handing in a promise when we setup the app?

## Dependenty injection

We're already employing the application shell pattern to provide state to our app, so what if we just take that one step further, and add a requests property to it? Then we could hand in request handlers at test and at load time. In fact, we could inject a request handler whenever and wherever.

This has broad implications. It decouples our component from the underlying details of the API it leverages, and it changes our dependency from a hard one into a configurable one.

That means if the API changes, or our target environment changes, or any number of changes occur, we've made sure the component no longer needs to change. All we'd have to do is hand in a different request that obeyed the same shape, and we can enforce that shape with Typescript.

## Updating things

We first update our tests. The shell now needs to be able to access the promise we hand it, in order to provide it to the rest of the program, so we'll start there. Remember that we're trying to keep our tests green, so we change either the test or the code, but not both, during refactors. That means, to begin with, we're going to pass the promise in and do nothing with it - after that, we'll switch over to leveraging it.

In tests, we inject a promise in select spots - only when the promise in question is being used. In spots where we're booting up MSW, in other words.

## Providing the requests

We're taking an object of functions as a parameter, so we want to make sure to memoize the property when we get it. Otherwise there's some risks that we'll accidentally do something to trigger unnecessary re-renders down our component hierarchy. Memos let us talk to React's runtime and assure it that things haven't changed, when that makes sense for us to say.

We're going to make a naive memo: our shell will only accept the _first_ requests object it gets, and then leave the others alone. That's essentially us saying "the thing you hand us at startup time - that's what we're going to use". Realistically, how often do we expect our requests to change during runtime, though? Next to never.

Once memoized, we draw up another provider, this time to distribute the request handlers we're now accepting. That leads to another context, which we leverage in our hook.

## Is this structure OK?

You'll notice that we stick close to the pattern we've already established for context providers - a context file, a provider file, and hooks in `hooks.ts`. Is this the best possible pattern to distribute context + provider component + hook? Maybe. Maybe not. Maybe it doesn't matter, for now. We've proven we can refactor without changing our tests, and as long as we keep our package interface cohesive (`import { thing } from 'shell'`), the other parts of our program don't care much about a package's internal structure.

So let's just go with it for now and we can move it around later if we like.

One hint that things may be amiss: our `RequestHandlers` type seems to have no home. We throw it in `src/shell/types.ts` for now, begrudgingly.

## Remove MSW?

As part of the fun of this update, we can now kick the training wheels out from MSW if we like, and just test to ensure that the promise we've handed in gets invoked. It's nice to test that the network gets called, but that seems like it might not be necessary here. Maybe down the road, to test integration with an API client? We'll keep MSW for now, we just don't need it in the test anymore.

## The Punchline

As a final bit, we put a successful promise in the requests prop on our main file - injecting the promise at runtime. We try logging in again, and it works! Success.

## Another Punchline

Of all the files we touched, we entirely avoided one. Did you notice? We haven't changed our `CreateUser` form at all. It is exactly the same as it was when we began.
