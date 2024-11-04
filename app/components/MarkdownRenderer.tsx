'use client'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      className="prose dark:prose-invert prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 
        prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-gray-800 
        prose-a:text-indigo-600 hover:prose-a:text-indigo-500
        prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-li:text-gray-600 prose-table:border-gray-300
        max-w-none text-base leading-relaxed"
      components={{
        code({ inline, className, children, ...props }: CodeProps) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              className="rounded-lg !my-4"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={`${className} font-mono text-sm`} {...props}>
              {children}
            </code>
          )
        },
        p: ({ children }) => <p className="my-3">{children}</p>,
        h1: ({ children }) => <h1 className="text-2xl font-bold my-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold my-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold my-2">{children}</h3>,
        ul: ({ children }) => <ul className="list-disc list-inside my-3">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside my-3">{children}</ol>,
        li: ({ children }) => <li className="my-1">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 my-3 text-gray-600 italic">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-gray-300">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 bg-gray-50 text-left text-sm font-semibold text-gray-700">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 border-t">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
} 