"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { AudioEngine } from "@/lib/audioEngine"

type EngineStatus = "idle" | "booting" | "ready" | "error"

interface UseAudioEngineOptions {
  /** Automatically boot the engine when the hook mounts. */
  autoBoot?: boolean
  /** Callback fired after the engine has successfully booted. */
  onReady?: (engine: AudioEngine) => void | Promise<void>
}

export function useAudioEngine({ autoBoot = true, onReady }: UseAudioEngineOptions = {}) {
  const [engine] = useState(() => new AudioEngine())
  const engineRef = useRef<AudioEngine | null>(engine)
  const [status, setStatus] = useState<EngineStatus>("idle")
  const [error, setError] = useState<unknown>(null)
  const bootPromiseRef = useRef<Promise<AudioEngine> | null>(null)
  const isMountedRef = useRef(true)
  const latestOnReady = useRef(onReady)

  useEffect(() => {
    latestOnReady.current = onReady
  }, [onReady])

  useEffect(() => {
    engineRef.current = engine
  }, [engine])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const boot = useCallback(async () => {
    if (status === "ready") return engine
    if (bootPromiseRef.current) return bootPromiseRef.current

    const promise = (async () => {
      if (isMountedRef.current) {
        setStatus("booting")
        setError(null)
      }

      await engine.boot()

      if (isMountedRef.current) {
        setStatus("ready")
        try {
          await latestOnReady.current?.(engine)
        } catch (readyError) {
          console.error("[v0] useAudioEngine onReady error:", readyError)
        }
      }

      return engine
    })().catch((err) => {
      if (isMountedRef.current) {
        setStatus("error")
        setError(err)
      }
      bootPromiseRef.current = null
      throw err
    })

    bootPromiseRef.current = promise
    return promise
  }, [engine, status])

  useEffect(() => {
    if (!autoBoot) return
    void boot()
  }, [autoBoot, boot])

  return {
    engine,
    engineRef,
    status,
    ready: status === "ready",
    error,
    boot,
  }
}

export type UseAudioEngineReturn = ReturnType<typeof useAudioEngine>
