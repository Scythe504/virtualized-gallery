import { useEffect, useMemo, useRef, useState } from "react"
import type { Photo } from "../hooks/useFetchPhotos"
import { ImageCard } from "./image-card"

interface VirtualGalleryProps {
  photos: Photo[]
}

const OVERSCAN = 2
const GAP = 8

export const VirtualGallery = ({
  photos,
}: VirtualGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

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

const columns = containerWidth < 600 ? 1 : containerWidth < 1024 ? 2 : 3
  const rowHeight = containerWidth / columns + GAP
  const rowCount = Math.ceil(photos.length / columns)
  const totalContentHeight = rowCount * rowHeight + (rowCount - 1) * GAP

  const startRow = Math.max(0, (Math.floor(scrollTop / rowHeight)) - OVERSCAN)
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
            />
          ))}
        </div>
      )
    }
    return rows
  }, [startRow, endRow, columns, photos])

  return (
    <div
      ref={containerRef}
      style={{ // viewPort
        height: "calc(100vh - 80px)",
        overflow: "auto"
      }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div
        style={{
          height: totalContentHeight,
          overflow: "hidden",
          contain: "strict"
        }}
      >
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
  )
}