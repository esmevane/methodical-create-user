# 012: Signaling work

So, we have a fairly robust component, and it's being powered by a pretty robust reducer. There's still some stuff left on the table for us to take care of: lots of repetition, maybe we could wiggle around the shape of our state some. Let's hold off for that, for now, though. Instead, let's get back to feature delivery.

What to add next?

We know that when we have errors, we communicate them. This is a pretty useful feature, but it also hides an assumption of ours. The assumption is this: we give the user of our app interaction when things go badly, but we don't give them any interactions when things are doing work, or when they're succeeding.

The work IS being done, and success IS there, but we don't communicate it. We have a graceful handling of problems in our system, but we can take it a bit further and let our users have full interaction. Instead, as far as our users (and our tests) are concerned, we have two states: explosions, and not explosions.

Our system does async work, let's demonstrate it.

## New tests

We add test cases for emails, passwords, and the form itself, to describe "working" and "success" statuses. We also add tests for our "idle" state, which we're thinking of as a pristine, unchanged state of the form.

Luckily, we don't have much work ahead of us. We added these statuses already - we made the change easy, now we can make the easy change.

## First failures

We start with a test for "checking email", when the reducer is working. We wait for it to pass - it never does. Why not? Well, we aren't explicitly entering into our reducer that updates begin a "working" status. Let's do that, now. Adding the status fixes the test, so we move on and do the same with the password.

## More failures

There's another "uh oh" moment when we try to test the form submission progress. We discover that we're not doing anything to actually communicate that we're making a request when we submit the form. We're simply sending a "registration-success" event because we want to clear errors.

We add another event to the reducer, and then we start calling that, to communicate what we're doing. Luckily we catch it, now, because this could be a weird bug later.

We add the state and resolve the tests for form submission progress.

## Success

As a next pass, we add success statuses as well. These go mostly as planned, except, again, the form success. We created a second gap when we changed the "registration-success" to a "registration-request". We don't acknowledge success anywhere! We write a test for that as well, and add a success dispatch at the end of a successful submission.

## Wrapping it up

That felt a lot easier than expected, didn't it? We expanded our features to be more interactive, adding a bunch of assertions in the process. It's more feature-complete and on top of that, it didn't take a whole lot of work. Though, it was somewhat boilerplate heavy, we were able to get something that definitely feels more robust.
