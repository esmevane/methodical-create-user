# 002: Submit a user

This step covers adding MSW and using it to create a fake registration API. The idea here is that we create a black box test for ourselves - a set of systems that as closely resemble the real world - and then use it to establish confidence that our own system collaborates with those other systems as we expect it to.

In this case, the system will be an external API that doesn't exist yet. But, the fact that it doesn't exist doesn't have to stop us from building code that expects to interact with it. If the real deal changes later, we can update our test to reflect those changes, then make them pass again.

## Why do it this way?

We can insert fake promises and test against those. In fact, we will eventually do that. This is an integration test, pure and simple. We don't want it to change unless the world changes around us.

## Isn't it a unit, if it just tests one component?

We're journeying through many black box systems already. JSX itself, then React's scheduler, and then React's renderer, and then JSDOM, and finally through Testing Library's assertions. We don't control the internals of any of those. Therefore, we're testing how they integrate.

We'll get to unit tests when we need to, but we'll have to work our way there, which we'll do, guided by tests.

## We're just testing in a single file?

Yeah. We're not really using any of this code yet. We'll keep it all in one file until it starts irritating us, or until we need to see it in action. Right now, it's easier to just test it where it is, and we don't really need to look at it first-hand yet either.

## Some meh spots

We've done some things in a not-so-great way. That's deliberate. The interior of this component is going to change a lot. We're also going to add tests, failure cases, and so on. Each time, we'll refactor this component.

What makes a refactor a refactor? Well, it's a refactoring if the output doesn't change. The test we've written here is our proof for those refactorings. So, the next thing we'll do is refactor it in prep for the next feature.
