import { useEffect, useMemo, useRef, useState } from "react"
import type { Photo } from "../hooks/useFetchPhotos"
import { ImageCard } from "./image-card"
import { Modal } from "./modal"
import type { WorkerMessage } from "../worker/imageProcessor.worker"
import { useWorker } from "../hooks/useWorker"
import { PreviewImage } from "./preview-image"

interface VirtualGalleryProps {
  photos: Photo[]
  selectionMode: boolean
}

const OVERSCAN = 2
const GAP = 8

export const VirtualGallery = ({ photos, selectionMode }: VirtualGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const worker = useWorker()

  useEffect(() => {
    if (!selectionMode) setSelectedIds(new Set())
  }, [selectionMode])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setContainerHeight(height)
      setContainerWidth(width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const columns = containerWidth < 600 ? 1 : containerWidth < 1024 ? 2 : 3
  const itemWidth = (containerWidth - (columns - 1) * GAP) / columns
  const rowHeight = itemWidth + GAP
  const rowCount = Math.ceil(photos.length / columns)
  const totalContentHeight = rowCount > 0 ? rowCount * rowHeight - GAP : 0

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN)
  const visibleRowCount = Math.ceil(containerHeight / rowHeight) + 2 * OVERSCAN
  const endRow = Math.min(rowCount, startRow + visibleRowCount)
  const offsetY = startRow * rowHeight

  const visibleRows = useMemo(() => {
    const rows = []
    for (let rowIndex = startRow; rowIndex < endRow; rowIndex++) {
      const slice = photos.slice(rowIndex * columns, rowIndex * columns + columns)
      rows.push(
        <div
          key={rowIndex}
          style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: `${GAP}px` }}
        >
          {slice.map((photo) => (
            <ImageCard
              key={photo.id}
              photo={photo}
              selectionMode={selectionMode}
              isSelected={selectedIds.has(photo.id)}
              onClick={() => selectionMode ? toggleSelect(photo.id) : setSelectedPhoto(photo)}
            />
          ))}
        </div>
      )
    }
    return rows
  }, [startRow, endRow, columns, photos, selectionMode, selectedIds])

  return (
    <>
      {selectionMode && (
        <div className="flex items-center gap-2 px-2 py-2">
          <input
            type="checkbox"
            checked={selectedIds.size === photos.length}
            onChange={() => selectedIds.size === photos.length
              ? setSelectedIds(new Set())
              : setSelectedIds(new Set(photos.map(p => p.id)))
            }
            className="w-4 h-4 cursor-pointer"
          />
          <span className="text-sm text-zinc-400">
            {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select All"}
          </span>
        </div>
      )}

      <div
        ref={containerRef}
        style={{ height: "calc(100vh - 80px)", overflow: "auto" }}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: totalContentHeight, overflow: "hidden", contain: "strict" }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              display: "flex",
              flexDirection: "column",
              gap: `${GAP}px`
            }}
          >
            {visibleRows}
          </div>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900 border-t border-zinc-700 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-zinc-400">{selectedIds.size} images selected</span>
          <button className="px-4 py-2 bg-white text-black text-sm rounded-md hover:bg-zinc-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              const p = photos.filter((photo) => selectedIds.has(photo.id))

              const message: WorkerMessage = {
                photos: p,
                requestId: crypto.randomUUID()
              }

              worker.postMessage(message)
            }}
          >
            Download Selected
          </button>
        </div>
      )}

      {selectedPhoto && (
        <Modal onClose={() => setSelectedPhoto(null)}>
          <PreviewImage photo={selectedPhoto} />
        </Modal>
      )}
    </>
  )
}
