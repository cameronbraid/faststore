import React, { Fragment, lazy, Suspense } from 'react'
import type { FC } from 'react'

const isOfflinePage = window.location.pathname.startsWith('/offline')

const Noop: FC = ({ children }) => <Fragment>{children}</Fragment>

const LazyProvider = lazy(() =>
  import('./Provider')
    .then(({ Provider }) => ({
      default: Provider,
    }))
    .catch((e) => {
      if (isOfflinePage) {
        return { default: Noop }
      }

      throw e
    })
)

export const Provider: FC = ({ children }) => (
  <Suspense fallback={null}>
    <LazyProvider>{children}</LazyProvider>
  </Suspense>
)
