/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react'
import { IntlProvider } from 'react-intl'
import type { WrapRootElementBrowserArgs } from 'gatsby'

import { localeFromPath } from '../helpers/path'
import type { PluginOptions } from '../gatsby-node'

const getLocale = (
  pathname: string,
  locales: string[],
  defaultLocale: string
) => {
  const locale = localeFromPath(pathname)
  const index = locales.indexOf(locale)

  if (index > -1) {
    return locales[index]
  }

  return defaultLocale
}

export const wrapRootElement = (
  { element: children, pathname }: WrapRootElementBrowserArgs,
  { defaultLocale, locales }: PluginOptions
) => {
  const path = pathname || window.location.pathname
  const locale = getLocale(path, locales, defaultLocale)
  // eslint-disable-next-line node/global-require
  const { default: getMessages } = require(`../i18n/${locale}`)
  const messages = getMessages()

  return (
    <IntlProvider
      locale={locale}
      defaultLocale={defaultLocale}
      messages={messages}
    >
      {children}
    </IntlProvider>
  )
}
