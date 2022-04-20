# 008: Gripe round two

Here we are, again, trying to figure out what to do about an inscrutable `act` error in our tests. Why does it keep coming back? Why is it in multiple places, now? How can we get rid of it, for good?

Let's think a bit about those questions.

Last time, we resolved our act issues by adding an `await` call in front of some of our user events. That told Testing Library that we cared about letting React's scheduler go through all of its pending work, and we wanted to let React finish that work before we moved on. We're still doing that, so what's the issue?

## Some experiments

To get to the bottom of it, we do some experimentation. We try moving the asynchrony around a bit, until at last we land on a form that works: in the click handler events themselves. In essence, we do away with the "useEffect" hooks entirely. Now, our functions are larger, but the test outcome is clear of act warnings.

## What in the world is going on?

React's `useEffect` hook is complex. It lets you run long-running processes, if you like, but it wants you to return a function that can terminate that process, at minimum. So, for example, if you create a `setInterval` handler, it wants you to return a function that clears the interval. If you provide that clear function, and a dependency array, then React trusts that it can terminate/restart the given effect, with the correct parameters, as needed.

Unfortunately, promises have no internal guarantee for their own termination. There's no cancellation API at all. That means that, if we leverage an effect with a promise inside of it, then React has no functional mechanism to clean up the promise in the event that it, say, unmounts or changes the given parameters.

By moving the code out of the effect hook and into a direct handler, React was able to properly await the resolution of the promise and regain control of render scheduling.

## But, we were using a promise the whole time

That's right. We were, weren't we? Why didn't React understand that we'd been running promises beforehand?

The truth is, here, that I'm not completely certain why the error surfaces in one case, every time, but not at all in the other. I did hunt to find the reason, but it's a tough one for me to figure out. I'd love to come back to this section at some point and update it with the reason, but for now, I'll just have to say that I think it's a great question.
