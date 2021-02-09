
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
export type SearchPageQueryQueryVariables = Exact<{
  query: Maybe<Scalars['String']>;
  map: Maybe<Scalars['String']>;
  fullText: Maybe<Scalars['String']>;
  staticPath: Scalars['Boolean'];
  selectedFacets: Maybe<Array<Vtex_SelectedFacetInput> | Vtex_SelectedFacetInput>;
  orderBy?: Maybe<Scalars['String']>;
}>;


export type SearchPageQueryQuery = { vtex: { searchMetadata: Maybe<{ title: Maybe<string>, description: Maybe<string> }>, productSearch?: Maybe<{ recordsFiltered: Maybe<number>, products: Maybe<Array<Maybe<{ productId: Maybe<string>, productName: Maybe<string>, linkText: Maybe<string>, items: Maybe<Array<Maybe<{ itemId: Maybe<string>, images: Maybe<Array<Maybe<{ imageUrl: Maybe<string>, imageText: Maybe<string> }>>> }>>> }>>> }>, facets?: Maybe<{ breadcrumb: Maybe<Array<Maybe<{ href: Maybe<string>, name: Maybe<string> }>>>, facets: Maybe<Array<Maybe<{ name: Maybe<string>, type: Maybe<Vtex_FilterType>, values: Maybe<Array<Maybe<{ key: Maybe<string>, name: Maybe<string>, value: Maybe<string>, selected: Maybe<boolean>, quantity: number, values: Maybe<Array<Maybe<{ key: Maybe<string>, name: Maybe<string>, value: Maybe<string>, selected: Maybe<boolean>, quantity: number, values: Maybe<Array<Maybe<{ key: Maybe<string>, name: Maybe<string>, value: Maybe<string>, selected: Maybe<boolean>, quantity: number }>>> }>>> }>>> }>>> }> } };


// Query Related Code

export const SearchPageQuery = {
  query: undefined,
  sha256Hash: "03ef58dd76c3b7035779006ec998ca98b8ee4e9e3e6a0fb087557e265817dd2a",
  operationName: "SearchPageQuery",
}

