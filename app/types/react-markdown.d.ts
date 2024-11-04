declare module 'react-markdown' {
  import { ComponentType, ReactNode } from 'react'
  
  export interface ReactMarkdownProps {
    children: string
    className?: string
    components?: Record<string, ComponentType<{ children?: ReactNode }>>
  }
  
  const ReactMarkdown: ComponentType<ReactMarkdownProps>
  export default ReactMarkdown
}

declare module 'react-syntax-highlighter' {
  import { ComponentType } from 'react'
  
  interface SyntaxHighlighterProps {
    children: string
    style?: object
    language?: string
    PreTag?: string | ComponentType
    className?: string
  }
  
  export const Prism: ComponentType<SyntaxHighlighterProps>
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const tomorrow: object
  export { tomorrow }
} 