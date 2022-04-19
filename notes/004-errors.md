# 004: Errors

We only know if things submit. We don't know if they succeed, and we don't know if they fail. Let's add some failure cases, and make them pass. Here's what we care about:

1. If it's not a real email, let's show an error message.
2. If it's not a long enough password, let's show an error message.
3. If the submission request fails, let's show an error message.
4. If there's an invalid email or password, let's refuse to submit the form.

## Validation library

We're installing `yup` as our validation library. It's pretty common at this point, but it also introduces a new complexity to our world: asynchrony. Asynchronous validations are how yup handles everything, and that makes sense: promises are great ways to describe processes that could take time, and in an opaque way.

However, writing interfaces which are projections of state is one thing - writing an interface which is a projection of _eventual_ state is quite another.

We'll start with the easiest implementation, conscious that it isn't the best implementation.

## Confession

I've done all of this in a way I enjoy, and while we're stepping in that direction, this isn't it. Doing it this way even just to illustrate why it doesn't work is very tough for me, and yet, I think it's the most obvious way to do it. If you're feeling the tensions with these implementations, don't worry: you aren't alone, it is tense and tough to model. We'll get there.

Complexity is everywhere and you can't just insist it go away because you don't want to deal with it. You have to face and wrangle it.

## Why do I dislike it?

You may've noticed that while the tests pass, there's a bunch of griping error messages in the console. That's right - we're doing it but React is pretty sure we're writing our code wrong. It's saying we're doing async things in ways that change state, which means it can't predict renders or protect us from memory leaks.

It's right. It can't protect us if we write code like this. We've made it impossible - and through no real fault of our own, or React's. We did the most obvious thing, it's so obvious, in fact, that the React team made an error message describing the problem to us.

We're going to do the most frustrating thing, and refuse to deal with the complaints React is giving us right now. Nothing is _actually_ broken, it just _might break_. The tests, however, pass. We'll think about how we model out eventual consistency in a little bit, and try to get a refactor that keeps the green tests, but removes the griping message.

## A decent form

Believe it or not, this form is mostly good. It does what we'd expect: takes passwords and emails and attempts to register them. It even has pretty robust error handling. This is our "baseline". From here, we'll seek to keep all of our tests passing while we refactor things.

We want to explore a bunch of different ways to model out this form. We want to do all sorts of stuff with it, but from here on out we'll obey this rule:

> _Either the test can change, or the component. Not both._
