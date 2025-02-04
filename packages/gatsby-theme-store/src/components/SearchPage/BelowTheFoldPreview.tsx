import { Center, Spinner } from '@vtex/store-ui'
import React from 'react'
import type { FC, CSSProperties } from 'react'

const BelowTheFoldPreview: FC = () => (
  <div
    style={
      ({
        contentVisibility: 'auto',
        containIntrinsicSize: '500px',
      } as unknown) as CSSProperties
    }
  >
    <Center height="500px">
      <Spinner />
    </Center>
  </div>
)

export default BelowTheFoldPreview
