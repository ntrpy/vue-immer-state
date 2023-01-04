# vue-immer-state

vue-immer-state is a minimalistic approach for state management in Vue using immer.

As a simple example, import createState() into your code and define your root state:

```typescript
import { createState } from 'vue-immer-state'

type User = { name: string }
type App  = { user: User }

const appState = createState<App>(
  { user: { name: 'Foo' } }
)
```

Every state offers an immutable reference to its stored value and (optionally) a commit method to update it.

Let's derive a user state from our app state:

```typescript
const userState = createState<User>(computed({
  get () { 
    return appState.ref.value.user 
  },

  set (value) { 
    appState.commit?.((app) => { app.user = value }) 
  }
}))
```

States are used as props on your components: 

```html
<User :user-state="userState" />
```

In your components you would then expect to receive States instead of the native types:

```html
<script setup lang="ts">
  const { userState } = defineProps<{
    userState: State<User>
  }>()

  // extract the ref for template usage
  const user = userState.ref
</script>

<template>
  <div>User {{ user.name }}</div>
</template>
```

Passing entire states to components prevents Vue from auto-unwrapping bare references, which is sometimes undesirable.

Use the commit method to update any state:

```typescript
userState.commit?.(
    (user) => { user.name = 'Bar' }
)
```

This walks up the dependency chain to the root state and updates its stored value.

If you define your state as readonly, or if you pass a readonly reference, then createState() will not provide the commit():

```typescript
const userState = createState<User>(computed(
    () => appState.ref.value.user
))

or 

const userState = createState<User>({ name: 'Foo' }, true)

// the following does nothing
userState.commit?.(
    (user) => { user.name = 'Bar' }
)
```

That's about it. For any further explanation on how to use the updater methods of immer, please confer their excellent project and its documentation: https://immerjs.github.io/immer/

Have fun!