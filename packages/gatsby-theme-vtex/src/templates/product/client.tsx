import { api } from '@vtex/gatsby-source-vtex'
import React, { FC, Suspense } from 'react'
import { useAsyncResource } from 'use-async-resource'

import ErrorBoundary from '../../components/ErrorBoundary'
import Layout from '../../components/Layout'
import ProductDetails from '../../components/ProductDetails'
import { AsyncProductProvider } from '../../components/providers/AsyncProduct'
import { SyncProduct } from '../../types/product'
import { isServer } from '../../utils/env'

interface Props {
  slug: string
}

const fetcher = async (slug: string) => {
  const responses = await fetch(api.search.bySlug(slug))
  const [product]: SyncProduct[] = await responses.json()
  return product
}

const ClientOnlyView: FC<Props> = ({ slug }) => {
  const [syncProductReader] = useAsyncResource(fetcher, slug)
  const syncProduct = syncProductReader()
  return (
    <AsyncProductProvider syncProduct={syncProduct}>
      <ProductDetails syncProduct={syncProduct} />
    </AsyncProductProvider>
  )
}

const ProductPage: FC<Props> = (props) => {
  if (isServer) {
    return <Layout />
  }

  return (
    <Layout>
      <ErrorBoundary fallback={<div>Error!</div>}>
        <Suspense fallback={<div>loading...</div>}>
          <ClientOnlyView {...props} />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  )
}

export default ProductPage
