import React, { Suspense, useEffect, useState } from 'react'
import type { FC, SuspenseProps } from 'react'

type Props = SuspenseProps

const HybridWrapper: FC<Props> = ({ fallback, children }) => {
  const [isHydrated, setIsHydrated] = useState(!!globalThis.__REACT_HYDRATED__)

  useEffect(() => {
    globalThis.__REACT_HYDRATED__ = true

    setIsHydrated(true)
  }, [])

  if (isHydrated) {
    return <Suspense fallback={fallback}>{children}</Suspense>
  }

  return <>{fallback}</>
}

export default HybridWrapper
