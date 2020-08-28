import React, { FC } from 'react'

import { ProductSummary_syncProductFragment } from '../__generated__/ProductSummary_syncProduct.graphql'
import { ProductSummary } from '../ProductSummary'

interface Props {
  products: Array<ProductSummary_syncProductFragment | undefined | null>
}

const Page: FC<Props> = ({ products }) => (
  <>
    {products.map((product, index) => (
      <ProductSummary
        loading={index === 0 ? 'eager' : 'lazy'}
        key={product!.productId!}
        product={product!}
      />
    ))}
  </>
)

export default Page
