import { createContext, useEffect, useRef } from "react";

export const WorkerContext = createContext<Worker | null>(null)

interface WorkerMessageResponse {
  drawnCanvasBlob: Blob,
  filename: string,
  requestId: string
}

export const WorkerProvider = ({ children }: {
  children: React.ReactNode
}) => {

  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../worker/imageProcessor.worker.ts", import.meta.url),
      { type: "module" }
    )

    workerRef.current.onmessage = (e) => {
      const { drawnCanvasBlob, filename }: WorkerMessageResponse = e.data
      const url = URL.createObjectURL(drawnCanvasBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }

    return () => workerRef.current?.terminate()
  }, [])

  return <WorkerContext.Provider value={workerRef.current}>
    {children}
  </WorkerContext.Provider>
}