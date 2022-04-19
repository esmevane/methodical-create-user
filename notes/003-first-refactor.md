# 003: First refactor

We've got our component and our test but we've done it with a few implicit couplings to DOM APIs. The usage of the APIs isn't, itself, the issue - those APIs are useful, good tools. In our case, though, we've done something which is definitely suboptimal.

What did we do? Well, we queried the DOM for data, with the `FormData` API.

## Sources of Truth

A big recurring theme of interface design will be the art of keeping your sources of truth tidy. The word "art" here is chosen deliberately - organizing sources of truth is hard, and full of compromise, and it's best to think of yourself as a gardener always tending your grove of truth.

In our case, we have a perfectly good source of truth here: our component. Here's what we're doing:

1. We use JSX to define some forms.
2. React renders the forms.
3. The user fills out the form
4. The user submits the form
5. We intercept the submission.
6. We get a reference to the rendered form.
7. We query the DOM rendered for the form, getting its data.
8. We create a payload by looping over the form fields.
9. We submit the payload.

Why are we making the round trip to the DOM? We control it. What can we do differently? Well, how about this:

1. We use JSX to define some forms.
2. React renders the form.
3. The user fills out the form.
4. We track all form changes as they happen.
5. The user submits the form.
6. We intercept the submission.
7. We submit the payload we've been tracking.

In the first one, our DOM is the source of truth. We need to query it to know what to do. In the second case, our component is the source of truth, and the component is simply our interface for the user.

## A True Refactor

What makes a true refactor? Well, it's a true refactor if the code still does exactly the same thing before and after a change. In other words, there's a lot of ways we can accomplish something, and a refactor is the act of trying out a different way of accomplishing a thing.

Luckily we've got a nice tool at our disposal for a refactor: our test. We can change our source of truth entirely, and as long as the test passes, we can say we've refactored. That's what this step does: it moves our source of truth from the DOM to the component itself. Instead of `FormData`, we use React's built-in `useState` hooks.

1. When the user changes an input, we update the related state.
2. When the user submits the form, we already know what they've put in the form.

## Projections of State

Here's the big fundamental change to our relocation of our sources of truth: we're actually no longer presenting our user with the DOM as you may imagine it. Every time the user inputs some information into one of our fields, they're not actually changing anything. Instead, React grabs the value, adds it to its internal state, and _redraws the form components with that new state_.

This is called a _controlled input_, and it's an important part of how we're going to be driving our design. In our world, our entire interface will be _controlled_ in a similar manner, and later on this will give us a lot of refactoring superpowers. In systems like this, you can think of your interface not as the centerpiece of your application, but rather as an expression of it. Or a "projection" of it.

We'll dive more into this concept later. It's a bit esoteric for now, but it'll do us a lot of good later to dig in more.
