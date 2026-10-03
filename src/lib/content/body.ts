import { lazy, type ComponentType } from 'react'

type LazyModule = { default: ComponentType }

export type LazyBody = {
  Component: ComponentType
  preload: () => Promise<unknown>
}

export function lazyBody(load: () => Promise<ComponentType>): LazyBody {
  let loaded: ComponentType | undefined
  const preload = () =>
    load().then((Component) => {
      loaded = Component
    })

  return {
    Component: lazy(() => {
      const ready = loaded
      // loader で先読み済みなら同期的に resolve する。Promise だと一度 suspend し、React の reveal throttle で本文が約 300ms 空く
      if (ready) return { then: (resolve: (m: LazyModule) => void) => resolve({ default: ready }) } as unknown as Promise<LazyModule>
      return load().then((Component) => ({ default: Component }))
    }),
    preload,
  }
}
