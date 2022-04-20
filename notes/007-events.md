# 007: Events

So what is the purpose of this hook? How does it give us an edge in our design? What makes it more than incidental indirection?

In a word: interfaces.

By splitting the component into its view and its view model, we're forced to think about how we want to communicate, and we're forced to look at where we do it. We have to construct a _model_, after all, for our _view_ to consume. This interface has three parts:

1. Our hook invocation, `useRegistrationForm`
2. The state portion of the return payload.
3. The events portion of the return payload.

Each of those pieces is, individually, pretty important. But, we're going to focus on the third piece, because, at least in my opinion, it is the most important.

## Why, though? Why are events the most important?

Well, interfaces give us two powers. They let us look at things, sure, but they also they let us do things. What an interface is capable of doing is specific to that interface: it can be interactions, automation, side-effects, and so on. Yet, _all_ of those motes of functionality can be described as _events_.

## Why make them all into "events"?

Why would we want to describe all of these things with a single interface? Well, cardinality. Or, put differently, the reduction of cardinality. We don't want to have feedback coming from all directions - we want a nice, orderly, queued set of events to work with. It makes it easier to reason about, for one thing, but it also goes back to what we said earlier about sources of truth.

Just like we don't want to think of the DOM and React as distinct sources of truth, we also want to organize all of our disparate events into a single stream, and make _that_ our source of truth.

## Our current events

So, what events do we have, already, hiding in our form?

First of all, let's revisit our idea of what an event is: for our purposes, an event is _any_ moment of interactivity. It encompasses user interactions, yes, but it also encompasses resulting side-effects, automated behavior, and interactions of any other system.

Here's some moments of interactivity that definitely apply:

1. When a user inputs email or password information, both of those moments are events.
2. Clicking the submit button is a submit event.

Those are obvious, but is that all? No. There are also our side effects:

1. Submitting the form can be successful, or fail. That's not one, but two events.
2. Similarly, every time email or password data changes, we start a validation process. That process can also succeed, or fail. That's up to 3 additional events.

All told, that is easily 3 events to describe user interactions, and 6-8 more events to describe resulting side-effects. That seems like a lot, doesn't it? We may not need all of those events, of course, but it brings us to our next major point.

## Implicit code and emergent complexity

It's so very tempting to say nonsense statements in life, but the most tempting nonsense in our industry is "just a simple X". It's almost never the case that we're able to imagine the full complexity of something up front. Imagine, before we began, that I'd asked you how many events you'd need to write a create user form. Would you be able to guess that you'd need, at minimum, nine distinct events?

Imagine how that emergent complexity would look in a world where you'd gone weeks, or months, before thinking formally about the distinct moments your software was supposed to model.

At the root of this is a human bias, which is this: often, we mistakenly that doing something takes as much effort as imagining it. I'm absolutely terrible at this, myself.

## For now

All of these events may seem like a lot of work to codify, but luckily, we can codify them now as part of a quick refactor. We're going to write a reducer, and we're going to plug it in.

## Acting up again

We refactor things, but our `act` error is back. And, this time it's griping at us in more places. Why?

Well, we've added event dispatches in to handle side-effects. We know we've refactored, not changed behavior, because all of our tests pass. In other words, we've taken one kind of state change and replaced it with a different kind of state change. Why in the world would this cause issues?

Good question. However, instead of answering it directly, we're going to do the frustrating thing, and commit what we have with the act gripe intact, again. We need to figure out how to manage our async side-effects.
