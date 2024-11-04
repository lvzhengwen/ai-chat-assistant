import { ReactNode } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }

  interface Window {
    [key: string]: any
  }
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    [key: string]: any
  }
}

declare module 'next' {
  interface LinkProps {
    href: string
    children?: ReactNode
    className?: string
    [key: string]: any
  }
}

declare module 'openai' {
  interface OpenAIConfig {
    apiKey: string
    baseURL: string
    dangerouslyAllowBrowser?: boolean
  }

  class OpenAI {
    constructor(config: OpenAIConfig)
    chat: {
      completions: {
        create: (params: any) => Promise<any>
      }
    }
  }

  export default OpenAI
}

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_DEEPSEEK_API_KEY: string
    [key: string]: string | undefined
  }
}

export {} 