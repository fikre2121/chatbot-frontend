"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "@/lib/types";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`group flex w-full gap-3 px-4 py-5 ${
        isUser
          ? "justify-end"
          : "justify-start bg-gray-50/70 dark:bg-gray-900/40"
      }`}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm"
          aria-label="AI assistant"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3 9 9l-6 3 6 3 3 6 3-6 6-3-6-3-3-6Z" />
          </svg>
        </div>
      )}

      {/* Message Content */}
      <div
        className={`min-w-0 ${
          isUser
            ? "max-w-[85%] sm:max-w-[70%]"
            : "max-w-[90%] flex-1 sm:max-w-[80%]"
        }`}
      >
        {/* Sender Label */}
        <p
          className={`mb-1.5 text-xs font-medium ${
            isUser
              ? "text-right text-gray-400 dark:text-gray-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {isUser ? "You" : "AI Assistant"}
        </p>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
            isUser
              ? "rounded-br-md bg-blue-600 text-white shadow-sm"
              : "rounded-bl-md bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/80 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="message-markdown min-w-0 break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-3 mt-2 text-xl font-bold">{children}</h1>
                  ),

                  h2: ({ children }) => (
                    <h2 className="mb-2 mt-4 text-lg font-semibold">
                      {children}
                    </h2>
                  ),

                  h3: ({ children }) => (
                    <h3 className="mb-2 mt-3 text-base font-semibold">
                      {children}
                    </h3>
                  ),

                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0">{children}</p>
                  ),

                  ul: ({ children }) => (
                    <ul className="mb-3 ml-5 list-disc space-y-1">
                      {children}
                    </ul>
                  ),

                  ol: ({ children }) => (
                    <ol className="mb-3 ml-5 list-decimal space-y-1">
                      {children}
                    </ol>
                  ),

                  li: ({ children }) => <li className="pl-1">{children}</li>,

                  blockquote: ({ children }) => (
                    <blockquote className="my-3 border-l-4 border-blue-400 pl-4 italic text-gray-600 dark:text-gray-300">
                      {children}
                    </blockquote>
                  ),

                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-words text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {children}
                    </a>
                  ),

                  code: ({ className, children, ...props }) => {
                    const isInline = !className?.includes("language-");

                    return isInline ? (
                      <code
                        className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85em] text-pink-600 dark:bg-gray-700 dark:text-pink-300"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code
                        className={`${className ?? ""} font-mono text-sm`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },

                  pre: ({ children }) => (
                    <pre className="my-3 max-w-full overflow-x-auto rounded-xl bg-gray-950 p-4 text-gray-100">
                      {children}
                    </pre>
                  ),

                  hr: () => (
                    <hr className="my-4 border-gray-200 dark:border-gray-700" />
                  ),

                  table: ({ children }) => (
                    <div className="my-3 max-w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                      <table className="w-full border-collapse text-left text-sm">
                        {children}
                      </table>
                    </div>
                  ),

                  th: ({ children }) => (
                    <th className="border-b border-gray-200 bg-gray-100 px-3 py-2 font-semibold dark:border-gray-700 dark:bg-gray-700">
                      {children}
                    </th>
                  ),

                  td: ({ children }) => (
                    <td className="border-b border-gray-200 px-3 py-2 dark:border-gray-700">
                      {children}
                    </td>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          className="mt-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-200"
          aria-label="You"
        >
          U
        </div>
      )}
    </div>
  );
}
