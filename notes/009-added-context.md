# 009: Added context

Things are starting to feel cumbersome in our single-file-and-test setup, but we have one more major update before we start to move things around into different spots: instead of a single component, we want to break up our form into multiple collaborating components. We're going to add a context, and we're going to use that to break our component up into several.

## Adding the context

Getting context into the mix is a big increase in our boilerplate. There's no denying that. We have two new hooks, two new context constants, a static type definition of our event payload, all sorts of stuff. It's such a large addition of boilerplate that it helps to see it all in one file, before we break that file up. Preserving this functionality and adding context has given us the same feature set (this is a "true refactor") but increased our file size by around 60 lines of code. Oof!

## More indirection?

Is this increase in boilerplate worth it? Yes. It absolutely is. Like all indirection, it's worth it in chiefly one circumstance: if it creates an easier to manage outcome. With the addition of this context, we gain a new React refactoring superpower: complex composition and isolation.

Which is to say, it won't be immediately obvious what we can do after introducing this context layer, but in the spirit of all refactors: we're making the work we _want to do next_ simpler with a few changes, now.

## The Shell

You may have wondered what "renderWithShell" meant all this time, and now you know. When we decoupled the registration form behavior, we primed it for use in a context, and distribution across the entire application. A convenient way to ensure global things have global reach is the "Shell" pattern, or in other words a single topmost component where you house all your setup.

Going forward, this shell will be the centerpiece of a lot of our refactoring and augmentation. It will contain almost all of our setup boilerplate, and integration boilerplate, so that the rest of our application can focus on actual features.
