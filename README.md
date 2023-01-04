# vue-immer-state

## Purpose
vue-immer-state is a minimalistic approach 
for state management in Vue using immer.

## Description
A State - in the sense of this library - is comprised of a reference to an immutable value, 
together with a method named commit to allow for changes to the value.

```typescript
type State<T> = DeepReadonly<{
    ref: Ref<T>
    commit?: (updater: (value: T) => void) => void
}>
```

Let's begin with a simple example, how you would define the state of a User model:

```typescript
import { createState } from 'vue-immer-state'

type User = { name: string }

const userState = createState<User>({ name: 'Foo' })
```

You can mutate its value by committing an update-method:

```typescript
// before
console.log(userState.ref.value.name)
> 'Foo'

userState.commit?.(
    (user) => { user.name = 'Bar' }
)

// after
console.log(userState.ref.value.name)
> 'Bar'
```

For any details on how update-methods work, please take a look at the documentation of the great immer project: https://immerjs.github.io/immer/

If you define your state as readonly, or if you pass a readonly reference, 
createState will not provide you with a commit-method:

```typescript
const userState = createState<User>(
  computed(() => appState.ref.value.user)
)

// or
const userState = createState<User>({ name: 'Foo' }, **true**)

// before
console.log(userState.ref.value.name)
> 'Foo'

// this has no effect
userState.commit?.(
    (user) => { user.name = 'Bar' }
)

// after
console.log(userState.ref.value.name)
> 'Foo'
```

Let's take a look at a more complex example and derive a User state from an App state:

```typescript
import { createState } from 'vue-immer-state'

type User = { name: string }
type App  = { user: User }

const appState = createState<App>(
  { user: { name: 'Foo' } }
)

const userState = createState<User>(
  computed({
    get () { 
      return appState.ref.value.user 
    },
    set (value) { 
      appState.commit?.((app) => { app.user = value }) 
    }
  })
)
```

Now, whenever we commit changes to the User state, this in turn updates the App state instead.
The changes then trickle down again to the reactive User state.

```typescript
// before
console.log(userState.ref.value.name)
> 'Foo'
console.log(appState.ref.value.user.name)
> 'Foo'

userState.commit?.(
    (user) => { user.name = 'Bar' }
)

// after
console.log(userState.ref.value.name)
> 'Bar'
console.log(appState.ref.value.user.name)
> 'Bar'
```

For states to work as prop values, you need to define your components properties as such:

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

Now passing state is straightforward:

```html
<User :user-state="userState" />
```

## Installation 
Use npm or yarn to install: 

```
> npm i ntrpy/vue-immer-state

or 

> yarn add ntrpy/vue-immer-state
```

Have fun!