import type { Photo } from "../hooks/useFetchPhotos"
import { useWorker } from "../hooks/useWorker"
import type { WorkerMessage } from "../worker/imageProcessor.worker"

interface ImageCardProps {
  photo: Photo
  selectionMode: boolean
  isSelected: boolean
  onClick: () => void
}

export const ImageCard = ({ photo, selectionMode, isSelected, onClick }: ImageCardProps) => {
  const thumbUrl = `https://picsum.photos/id/${photo.id}/400/400`
  const worker = useWorker()

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden aspect-square w-full rounded-sm shadow-sm shadow-zinc-700 transition-all duration-200 ease-in-out cursor-pointer
        ${selectionMode ? "hover:opacity-90" : "hover:scale-105 transition-transform duration-300"}
        ${isSelected ? "ring-2 ring-white ring-offset-1 ring-offset-black" : ""}
      `}
    >
      <div className="absolute top-0 left-0 right-0 z-10 bg-linear-to-b from-black/50 to-transparent">
        <p className="mx-2 py-1 text-sm truncate text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
          By: {photo.author}
        </p>
      </div>

      {isSelected && (
        <div className="absolute inset-0 bg-white/20 z-10" />
      )}

      <img
        src={thumbUrl}
        alt={photo.author}
        width={400}
        height={400}
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-linear-to-t from-black/60 to-transparent flex justify-end p-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            const message: WorkerMessage = {
              photo: photo,
              requestId: crypto.randomUUID()
            }
            worker.postMessage(message)
          }}
          className="text-xs text-white p-2 px-4 rounded bg-black/40 hover:bg-black/70 transition-colors"
        >
          Download
        </button>
      </div>
    </div>
  )
}