import { produce } from "immer"
import { shallowRef, Ref, isReadonly as isReadonlyRef, DeepReadonly } from "vue"

export type State<T> = DeepReadonly<{
    ref: Ref<T>
    commit?: (updater: (value: T) => void) => void
}>

export function createState<T>(
    value: T | Ref<T>,
    isReadonly: boolean = false
): State<T> {
    const _ref = shallowRef(value) as Ref<T>

    return {
        ref: _ref as State<T>['ref'],

        ...(!isReadonly && !isReadonlyRef(_ref) && {
            commit: (updater) => {
                const next = produce(_ref.value, updater)
                _ref.value = next
            }
        })
    }
}