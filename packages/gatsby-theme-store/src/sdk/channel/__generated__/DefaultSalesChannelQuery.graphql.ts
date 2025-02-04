
/**
 * Warning: This is an autogenerated file.
 *
 * Changes in this file won't take effect and will be overwritten
 */

// Base Types
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type Maybe<T> = T | null | undefined
type Scalars = {
  Boolean: boolean
  String: string
  Float: number
  Int: number
  ID: string
}

// Operation related types
export type DefaultSalesChannelQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type DefaultSalesChannelQueryQuery = { allChannel: { edges: Array<{ node: { salesChannel: Maybe<number> } }> } };


// Query Related Code

export const DefaultSalesChannelQuery = {
  query: process.env.NODE_ENV === 'production' ? undefined : "query DefaultSalesChannelQuery {\n  allChannel(filter: {targetProduct: {eq: \"vtex-storefront\"}}, limit: 1) {\n    edges {\n      node {\n        salesChannel\n      }\n    }\n  }\n}\n",
  sha256Hash: "18f145e4e0328acb654db7db826c7ff6072a4fad16c8951a10c084d733c2ca0d",
  operationName: "DefaultSalesChannelQuery",
}

