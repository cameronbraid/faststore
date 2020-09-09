import React, { FC } from 'react'
import { gql } from '@vtex/gatsby-plugin-graphql'

import OverlaySpinner from '../SearchPage/OverlaySpinner'
import Shelf, { Props as ShelfProps } from '.'
import {
  ShelfQuery,
  ShelfQueryQuery,
  ShelfQueryQueryVariables,
} from './__generated__/ShelfQuery.graphql'
import { useQuery } from '../../sdk/graphql/useQuery'

interface Props extends Omit<ShelfProps, 'products'> {
  searchParams: {
    map: string
    query: string
    from: number
    to: number
    orderBy: string
  }
  // Get this from types
}

const AsyncShelf: FC<Props> = ({ searchParams, ...props }) => {
  // Maybe adapt useSearch to be used here

  const { data } = useQuery<ShelfQueryQuery, ShelfQueryQueryVariables>({
    ...ShelfQuery,
    variables: searchParams,
  })

  if (!data) {
    return <OverlaySpinner />
  }

  return <Shelf products={data.vtex.productSearch?.products ?? []} {...props} />
}

export const query = gql`
  query ShelfQuery(
    $query: String
    $map: String
    $from: Int
    $to: Int
    $orderBy: String
  ) {
    vtex {
      productSearch(
        query: $query
        map: $map
        from: $from
        to: $to
        orderBy: $orderBy
      ) {
        products {
          ...ProductSummary_syncProduct
        }
      }
    }
  }
`

export default AsyncShelf
