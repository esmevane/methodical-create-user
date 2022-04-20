# 005: Fix the gripe

So how do we fix this async error message our tests are giving us?

That is a _great_ question. This error, known as the `act` error, is the most prevalent source of stress I've seen in the React testing world. In fact, if I were to guess, I'd say the amount of time people spend figuring this specific gripe out is the foremost cause of people's complaint about the complexity of testing React.

## Where is ours coming from?

We've got 3 async spots. Here they are:

1. We invoke `fetch`. That's async.
2. We check out if emails are valid. That's also async.
3. We do the same for passwords. Also async.

But, most importantly, as part of each of those async operations, we _change the component state_. The asynchrony itself isn't the issue: if we launch a promise off into the ether, it eventually settles and gets garbage collected. In most cases, at least. So initializing the promise in a component? Not a big deal.

However, one thing we are doing is updating state at the tail end of those promises. That means we're essentially "saving" a reference to the component inside of the promise, and that means there's kind of risk there that the reference will outlive the component itself.

React can pick up on this, and is actually extremely likely to pick up on it in tests - specifically because we automatically unmount everything at the end of each assertion.

## Say again?

In some cases, we're attempting to update the component after it's been unmounted. That can cause a lot of bugs. React is griping at us, sure, but it's trying to be helpful.

## What do we do?

Well, again, great question. This used to be a tough one, but luckily these days the ecosystem has risen to the occasion. You may have noticed that we're writing our tests as asynchronous by default. That's deliberate. A great deal of Testing Library's tooling can be used to test for _eventual_ results. That's what we want to do, here.

It's almost criminally simple what we need to do: we add an `await` in front of our click handlers for the form. Just like that, the error goes away.

## What happened?

When we added the await, we gave Testing Library time to resolve. It doesn't need much. But, just that little bit of breathing room allows all of the React and JS schedulers to resolve any pending work out there inside of promises. After that, we can let test cleanup proceed and unmount anything it may need to.
