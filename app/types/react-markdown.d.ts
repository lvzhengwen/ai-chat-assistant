declare module 'react-markdown' {
  import React from 'react'
  
  export interface ReactMarkdownProps {
    children: string
    className?: string
    components?: Record<string, React.ComponentType<any>>
  }
  
  const ReactMarkdown: React.FC<ReactMarkdownProps>
  export default ReactMarkdown
}

declare module 'react-syntax-highlighter' {
  const SyntaxHighlighter: React.ComponentType<any>
  export { SyntaxHighlighter as Prism }
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const tomorrow: any
  export { tomorrow }
} 