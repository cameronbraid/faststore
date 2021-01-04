import { join } from 'path'

import ConfigStore from 'configstore'
import { outputJSON, pathExists } from 'fs-extra'
import fetch from 'isomorphic-unfetch'
import type { JSONSchema6 } from 'json-schema'
import type {
  CreatePagesArgs,
  PluginOptionsSchemaArgs,
  SourceNodesArgs,
} from 'gatsby'
import {
  buildNodeDefinitions,
  compileNodeQueries,
  createDefaultQueryExecutor,
  createSchemaCustomization,
  generateDefaultFragments,
  loadSchema,
  sourceAllNodes,
} from 'gatsby-graphql-source-toolkit'

import type { ContentTypes, Schemas } from './index'

// VTEX IO workspace
const WORKSPACE = 'master'

interface CMSContentType {
  id: string
  name: string
  previewUrl: string
  messages: Record<string, string>
  blocks: Array<{ name: string; schema: JSONSchema6 }>
  beforeBlocks: Array<{ name: string; schema: JSONSchema6 }>
  afterBlocks: Array<{ name: string; schema: JSONSchema6 }>
  extraBlocks: Array<{
    name: string
    blocks: Array<{ name: string; schema: JSONSchema6 }>
  }>
}

const { name } = require('./package.json')

const root = process.cwd()

const CONTENT_TYPES_PATH = join(root, 'public/page-data/_cms/contentTypes.json')
const SHADOWED_INDEX_PATH = join(root, 'src', name, 'index.ts')
const PREVIEW_PATH = '/cms/preview'

interface Options {
  tenant: string
  appKey: string
  appToken: string
}

export const pluginOptionsSchema = ({ Joi }: PluginOptionsSchemaArgs) =>
  Joi.object({
    tenant: Joi.string().required(),
    appKey: Joi.string(),
    appToken: Joi.string(),
  })

const getAccessToken = async (appKey: string, appToken: string) => {
  try {
    if (!appKey || !appToken) {
      const config = new ConfigStore('vtex')

      return config.get('token')
    }

    const response = await fetch(
      `https://vtexid.vtex.com.br/api/vtexid/pub/authenticate/default?user=${appKey}&pass=${appToken}`,
      {
        headers: {
          accept: 'application/json',
        },
      }
    )

    const json = await response.json()

    return json.authCookie.Value
  } catch (err) {
    console.error(err)

    return ''
  }
}

export const sourceNodes = async (
  args: SourceNodesArgs,
  { tenant, appKey, appToken }: Options
) => {
  const { reporter } = args
  const accessToken = await getAccessToken(appKey, appToken)

  if (!accessToken) {
    reporter.panicOnBuild(
      'No appKey/appToken or local config found. Please login with `vtex login` or add the appKey/appToken env vars'
    )

    return
  }

  // Step1. Set up remote schema:
  const executor = createDefaultQueryExecutor(
    `https://app.io.vtex.com/vtex.admin-cms-graphql/v0/${tenant}/${WORKSPACE}/_v/graphql`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: `VtexIdclientAutCookie=${accessToken}`,
      },
    }
  )

  const schema = await loadSchema(executor)

  // Step2. Configure Gatsby node types
  const gatsbyNodeTypes = [
    {
      remoteTypeName: `PageContent`,
      queries: `
        query LIST_PAGES ($first: Int!, $after: String ) {
          pages (first: $first, after: $after, builderId: "faststore") {
            edges {
              node {
                ...PageContentFragment
              }
            }
          }
        }
        fragment PageContentFragment on PageContent { __typename id }
      `,
    },
  ]

  // Step3. Provide (or generate) fragments with fields to be fetched
  const fragments = generateDefaultFragments({ schema, gatsbyNodeTypes })

  // Step4. Compile sourcing queries
  const documents = compileNodeQueries({
    schema,
    gatsbyNodeTypes,
    customFragments: fragments,
  })

  const config = {
    gatsbyApi: args,
    schema,
    execute: executor,
    gatsbyTypePrefix: `vtexCms`,
    gatsbyNodeDefs: buildNodeDefinitions({ gatsbyNodeTypes, documents }),
  }

  // Step5. Add explicit types to gatsby schema
  await createSchemaCustomization(config)

  // Step6. Source nodes
  await sourceAllNodes(config)
}

export const createPages = async ({ graphql, reporter }: CreatePagesArgs) => {
  const { data, errors } = await graphql(`
    {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `)

  if (errors && errors.length > 0) {
    reporter.panicOnBuild(
      'Seomething went wrong while querying site metadata',
      errors
    )
  }

  const {
    site: {
      siteMetadata: { siteUrl },
    },
  }: { site: { siteMetadata: { siteUrl: string } } } = data as any

  // Read index.ts from shadowed plugin
  const exists = await pathExists(SHADOWED_INDEX_PATH)

  if (!exists) {
    return
  }

  require('@babel/register')({
    extensions: ['.ts'],
    presets: ['@babel/preset-typescript'],
  })
  const { contentTypes } = require(SHADOWED_INDEX_PATH) as {
    schemas: Schemas
    contentTypes: ContentTypes
  }

  // Transform all contentTypes into CMS ready contentType json
  const contentTypesCMS = Object.keys(contentTypes).reduce((acc, key) => {
    const ct = contentTypes[key]

    const blocks = Object.keys(ct.blocks).map((k) => ({
      name: k,
      schema: ct.blocks[k],
    }))

    const beforeBlocks = Object.keys(ct.beforeBlocks).map((k) => ({
      name: k,
      schema: ct.beforeBlocks[k],
    }))

    const afterBlocks = Object.keys(ct.afterBlocks).map((k) => ({
      name: k,
      schema: ct.afterBlocks[k],
    }))

    const extraBlocks = Object.keys(ct.extraBlocks).map((k) => ({
      name: k,
      blocks: Object.keys(ct.extraBlocks[k]).map((kk) => ({
        name: kk,
        schema: ct.extraBlocks[k][kk],
      })),
    }))

    acc.push({
      ...ct,
      id: key,
      previewUrl: join(siteUrl, PREVIEW_PATH),
      blocks,
      beforeBlocks,
      afterBlocks,
      extraBlocks,
    })

    return acc
  }, [] as CMSContentType[])

  await outputJSON(CONTENT_TYPES_PATH, contentTypesCMS)
}
