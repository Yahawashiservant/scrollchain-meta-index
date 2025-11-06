"use client"

import type { PropsWithChildren } from "react"
import clsx from "clsx"

import AudioReactiveBackground from "@/components/AudioReactiveBackground"

interface EngineBootScreenProps {
  title: string
  message?: string
  className?: string
  titleClassName?: string
  messageClassName?: string
}

export function EngineBootScreen({
  title,
  message,
  className,
  titleClassName,
  messageClassName,
  children,
}: PropsWithChildren<EngineBootScreenProps>) {
  return (
    <main className={clsx("min-h-screen text-gray-100 flex items-center justify-center relative", className)}>
      <AudioReactiveBackground />
      <div className="relative z-10 text-center space-y-4">
        <div
          className={clsx(
            "text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent",
            titleClassName,
          )}
        >
          {title}
        </div>
        {message ? (
          <div className={clsx("text-sm opacity-70 animate-pulse", messageClassName)}>{message}</div>
        ) : null}
        {children}
      </div>
    </main>
  )
}

export default EngineBootScreen
