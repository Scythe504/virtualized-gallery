import { useContext } from "react"
import { WorkerContext } from "../context/WorkerContext"

export const useWorker = ()=> {
  const worker = useContext(WorkerContext)
  if (!worker) throw new Error("useWorker must be used inside WorkerProvider")

  return worker
}