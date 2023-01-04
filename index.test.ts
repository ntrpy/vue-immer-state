import { computed } from 'vue'
import { createState } from './index'

type User = { name: string }
type App = { user: User }

test('create user state', () => {
    const userState = createState<User>({ name: 'Foo' })
    const user = userState.ref

    expect(user.value.name).toBe('Foo')
})

test('modify user state', () => {
    const userState = createState<User>({ name: 'Foo' })
    const user = userState.ref

    userState.commit?.((user) => { user.name = 'Bar' })

    expect(user.value.name).toBe('Bar')
})

test('create derived state', () => {
    const appState = createState<App>({
        user: { name: 'Foo' }
    })

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

    const user = userState.ref

    expect(user.value.name).toBe('Foo')
})

test('modify derived state', () => {
    const appState = createState<App>({
        user: { name: 'Foo' }
    })

    const app = appState.ref

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

    const user = userState.ref

    userState.commit?.((user) => { user.name = 'Bar' })

    expect(app.value.user.name).toBe('Bar')
    expect(user.value.name).toBe('Bar')
})

test('modify readonly user state', () => {
    const userState = createState<User>({ name: 'Foo' }, true)
    const user = userState.ref

    userState.commit?.((user) => { user.name = 'Bar' })

    expect(user.value.name).toBe('Foo')
})