# 011: Status checks

We've left a sneaky issue in the work as we've gone on. It doesn't look bad, right? Have you noticed something off? If so, it might be bothering you.

Here's the issue: we're making _logical_ choices about the shape of our state in our _component_, instead of the hook.

It's `hasFormError`, `hasEmailError`, and `hasPasswordError`. They're boolean coercions, which leaves us in a place where we're tempted to say they're not really big issues: booleans can hide complexity, or they can avoid complexity. It's always tough to gauge which is which.

A common rule of thumb here is this: it's fine to make boolean _decisions_, but it isn't necessarily fine to _compose booleans_. In other words, according to this rule, we could maybe calculate the booleans in the `useRegistrationForm` hook and then check them in the component, right? Sure.

Yet, that itself is just moving them. They're still switches, in essence, and by focusing on the locality of them, we're only resolving one issue. We aren't thinking about what they are.

## Status states

So, what are they? Well, they're status states. The issue isn't that they're booleans, and in fact the whole topic of boolean locality is just a tempting hedge around the real issue, which is this: `hasFormError` is simply asking the question, "What is the status of the form? Is it an error?"

The root of the problem here is probably culpable for an entire category of front-end bugs, and maybe bugs in general. We don't want to know if `hasFormError` is true. We want to keep an eye on the _overall status of the form_.

Because we didn't take a minute to set some sort of system up for communicating the _status_ of the form, the _component_ is left to look at data, and coerce that data into _logical shapes_ to _derive the information for itself_.

## The change

The change here is very subtle, but it'll set us up for easier interface changes later. We add some `status` fields and reorganize our state a bit. The component will afterward simply change based on varying `status` reports it gets from the hook. No more derived calculations, no more split between the sources of truth, and we preserve the boolean "cleanliness" on the frontmost layer of the view.

As part of the change, we're also going to change our state shape a bit as well. Remember, we have tests describing all of our functionality already. Our reducer is still an implementation detail. React owns it. We want to know about whether or not it does what we want or not.

## Types

As a nice bonus, we're leaning into our type system a bit more. That means we can just check to see if a status is in an `AsyncStatus` field and in most editors Intellisense will help us autocomplete, or yell at us when we get something wrong. Bits of our domain in autocomplete! It feels nice.
