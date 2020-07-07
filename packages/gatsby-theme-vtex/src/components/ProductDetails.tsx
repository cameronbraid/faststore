/** @jsx jsx */
import { FC, Fragment, useEffect } from 'react'
import { Card, Grid, Heading, jsx } from 'theme-ui'

import { SyncProduct } from '../types/product'
import { BuyButton } from './BuyButton'
import { Offer } from './Offer'
import ProductImage from './ProductImage'
import { useCurrency } from './providers/Binding'
import SEO from './Seo'

interface Props {
  syncProduct: SyncProduct
}

// Code-splits structured data injection
// because it's not critical for rendering the page.
// const injectStructuredDataLazily = async (
//   product: Product,
//   currency: string
// ) => {
//   const {
//     default: { injectProduct },
//   } = await import('./structuredData')
//   injectProduct(product, currency)
// }

const ProductDetailsTemplate: FC<Props> = ({ syncProduct }) => {
  // const [currency] = useCurrency()
  const { productName } = syncProduct

  // Inject StructuredData after rendering so we don't block the
  // rendering process and harm performance
  // useEffect(() => {
  //   if (dynamicProduct) {
  //     injectStructuredDataLazily(dynamicProduct, currency)
  //   }
  // }, [currency, dynamicProduct])

  return (
    <Fragment>
      <SEO title={productName} />
      <Grid my={4} mx="auto" gap={[0, 3]} columns={[1, 2]}>
        <ProductImage
          width={500}
          height={500}
          product={syncProduct}
          lazyLoad={false} // Never lazy load image in product details
        />
        <Card>
          <Heading variant="productTitle" as="h1">
            {productName}
          </Heading>
          <Offer />
          <BuyButton skuId={syncProduct?.items[0].itemId} />
        </Card>
      </Grid>
    </Fragment>
  )
}

export default ProductDetailsTemplate
