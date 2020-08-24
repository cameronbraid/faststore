import { jsx, ThemeProvider } from '@theme-ui/core'
import { WrapRootElementBrowserArgs } from 'gatsby'

import theme from './index'

export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) =>
  jsx(
    ThemeProvider,
    {
      // It has to be a function so the great theme-ui
      // implementation does not try to deep merge unecessarily
      theme: () => theme,
    },
    element
  )
