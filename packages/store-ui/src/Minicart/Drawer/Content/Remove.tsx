import React, { useCallback, useState } from 'react'
import { Button } from 'theme-ui'
import type { PropsWithChildren } from 'react'

import Spinner from '../../../Spinner'
import type { Item } from '../../types'

interface Props<T> {
  item: T
  variant: string
  removeItem: (item: T) => Promise<void> | void
}

const MinicartDrawerRemoveItem = <T extends Item>({
  item,
  variant,
  removeItem,
}: PropsWithChildren<Props<T>>) => {
  const [isLoading, setIsLoading] = useState(false)

  const onClick = useCallback(async () => {
    try {
      setIsLoading(true)
      await removeItem(item)
    } finally {
      setIsLoading(false)
    }
  }, [item, removeItem])

  return (
    <Button variant={`${variant}.delete`} onClick={onClick}>
      {isLoading ? (
        <Spinner width={24} height={24} />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM9 9h6c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H9c-.55 0-1-.45-1-1v-8c0-.55.45-1 1-1zm6.5-5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1h-2.5z" />
        </svg>
      )}
    </Button>
  )
}

export default MinicartDrawerRemoveItem
