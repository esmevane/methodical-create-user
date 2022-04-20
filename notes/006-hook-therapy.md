# 006: Hook therapy

Let's make our component easier to wield, with a custom hook.

It's a pretty straightforward refactoring - we move all of our variables except the boolean checks ("hasFormErrors") into a hook, and give them named exports. We use the `[values, events]` tuple format that React itself uses for most of its hooks.

Right now, this is just moving the complexity, but our tests let us do that without much fighting. Obeying the rule of changing either the test or the component, we change the component and keep the tests green.

## Did we gain anything?

Oh yeah, definitely, yes. "You're just moving the complexity" is often a reasonable way to sound clever, but it misses the point a lot of the time, which is this: where your complexity happens to be is incredibly important. It's surprising how many incredible issues you can resolve with a single layer of well-considered indirection.

In our case, the indirection is, again, a hook wrapper, but the result is much larger: we've cleaved a single thing (our component) into two things (our component, and its hook). If you're familiar with interface patterns, you've maybe heard of the View + View Model pattern. That's what we're looking at, here, in a sense.

Now we have these:

1. Our view (the component), which is in charge of displaying an interface for the user, and listening to what the user does.
2. Our view model (the hook), which is in charge of managing the internal logic of the component.

## Planes of change

We have established what I call two "planes of change". This concept is huge for interface design. Essentially we have two spots where refactoring can occur without needing to worry about introducing meaningful complexity to the other spot. We can move each plane around, change what it does, and so on.

In practice, if you're on a team, it means two people can work on this component without battering one another's code, more often than not.

In our following steps, we're going to leverage this decoupling moment to dramatically change how things work on both view and view model layers.
