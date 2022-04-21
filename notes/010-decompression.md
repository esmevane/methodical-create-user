# 010: Decompression

I don't know about you, but I'm pretty tired of the current directory structure. I really want to change it. Let's quit wasting time, and do that now.

## Moving things around

Here's our new structure:

```
src/
  app/
    create-user.spec.tsx
    create-user.tsx
  core/
    index.ts
    registration.ts
  shell/
    hooks.ts
    index.tsx
    registration-context.ts
    registration-provider.tsx
  favicon.svg
  main.tsx
  test-utils.tsx
  vite-env.d.ts
```

And, yes, we will be removing the previous Vite boilerplate, finally. Finally.

Let's go over the purpose of every new location we've created.

### App

It isn't just alphabetical, it's _controversial_. Why not `components`? Because, well, we don't have any components yet. That's why.

But, haven't we written components? Isn't `CreateUser` a component? Yes, technically, on both accounts. That is the terminology. We're not shying away from that at all, really. What we _are_ shying away from is putting them in a folder and calling it `components`.

Here's why: there are useful abstractions and then there are not-so-useful ones. The `component` abstraction is shockingly generic - so generic, in fact, that it holds value across every imaginable software domain. If you're making an abstract library for the entire open source community to use - for example, a view rendering library, such as React - then the term "component" is exactly what you want, because it'll speak to a versatile array of cases.

For our purposes, though, it's far too abstract. If we create a `components` folder right now, we succumb to an eternity of weird temptations for ourselves and our colleagues. Should we put all `tsx` files in there? Should we capitalize files differently if they're a specific kind of file? Why would we put components in one spot, but not another?

What we've built right now are components, yes, but they serve very clear purposes. Presently, our `CreateUser` component is an entire process in one - and it's our entire app. It is an `app` component, and so that's where we're going to put it.

As we go, when we identify truly general purpose components, we'll tease them out of `CreateUser` and at that point we'll probably need a `components` package to house them.

#### What if we know something is general use?

It is true that some things are obviously general use. For example, we probably know that `CreateUser` will yield an `Input` or `Button` component at some point. Pulling them out now, though, could be a big mistake - what if we don't know all of the things that component will have to do? Then we expand the surface area of change every time we have to do something to update those components.

That's not always a problem, though! Sometimes it's just right for your team - for example, if you have a strong visual design team member and a strong logical engineering member collaborating, then maybe it makes sense to let them collaborate through a `components` shared medium. That is an incredibly nice situation to find yourself in, but it isn't everyone's.

When in doubt, start with concretions, and gradually tease out your abstractions. It's easier to maintain duplication than the wrong abstraction.

### Core

This is the logical core of our app. This is where all of our behavior will live, in hermetic isolation. If you're the sort of person who seeks out "unit testing", this is the package for you - at no point should knowledge of the React world enter into this part of the system. If we play our cards right, this part of our system will power the entire marionnette of our view layer, and one day if we decide to split off from React, it should be portable enough to help in that transition.

### Shell

You may have heard the phrase "functional core, imperative shell". Our shell package is the formal integration layer between our logic and the React interface which consumes it. If we were issuing our packages to the public as open source systems, then you could imagine this package is our React bindings. Our "core-react" if you will.

Shell manages setup of React, integration with the core package, and it offers a public interface for those systems to be consumed: hooks, provider components, and so on.

### Test Utils

Our test setup and helpers go here. It's actually just a file for now, but it tends to grow with time.

## Absolute paths

You may have noticed that when we import things, we're not importing _anything_ using relative notation when we need to travel upwards in our directory structure (we are, however, using relative paths to go _downward_ or to _adjacent_ files). This is something we set up back in [Add tests](./001-add-tests.md).

Essentially, we told Typescript, Vite, and Jest that they could consider `src` as an equal to `node_modules` for the sake of importing packages. That means any time we import something, it also looks to see if there's a file in `src` with that name.

In other words, we can treat "top-level packages" as published node packages for the purposes of importing their code, and we don't have to worry about transpiling or any other build tooling setup. In my opinion, this leads to a simpler refactoring experience, and it encourages us to worry about proper package principles and import hygiened as we build. All worthwhile things to set up early.
