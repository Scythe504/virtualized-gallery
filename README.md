# Virtualized Gallery

A performant image gallery built with React + TypeScript that displays 1000+ images without lag using list virtualization, Canvas watermarking, and Web Workers.

## Features

- **List Virtualization** — only renders images visible in the current scroll window. DOM node count stays constant (~18 nodes) regardless of scroll position across 1000 images.
- **Canvas Watermark** — download any image with "Celebrare" burned into it via the Canvas API. Not a CSS overlay — the watermark is drawn directly onto an `OffscreenCanvas` and baked into the downloaded file.
- **Web Worker** — all canvas processing (fetch → draw → encode) happens off the main thread so the UI stays responsive during downloads.
- **Fullscreen Preview** — click any image to open a fullscreen modal. Click outside or press Escape to close.
- **Selection Mode** — hit Select to enter selection mode. Select individual images or use Select All. Download all selected images at once via the bottom tray.
- **Responsive Grid** — 1 column on mobile, 2 on tablet, 3 on desktop. Virtualization math updates on resize via `ResizeObserver`.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Picsum Photos API

## Project Structure

```
src/
├── components/
│   ├── image-card.tsx        # Individual image card with download button
│   ├── virtualized-list.tsx  # Core virtualization logic
│   ├── modal.tsx             # Fullscreen image preview
│   └── loader.tsx
├── context/
│   └── WorkerContext.tsx     # Worker instance provider + onmessage handler
├── hooks/
│   ├── useFetchPhotos.ts     # Fetches photos from Picsum API
│   └── useWorker.ts          # Consumes WorkerContext
├── worker/
│   └── imageProcessor.worker.ts  # Fetches image, draws on OffscreenCanvas, posts blob back
└── utills/
    └── sharedWatermark.ts    # Shared watermark drawing function used by the worker
```

## How Virtualization Works

The gallery calculates which rows are currently visible based on `scrollTop` and only renders those rows plus an overscan buffer:

```
rowHeight     = containerWidth / columns + gap
rowCount      = ceil(totalImages / columns)
totalHeight   = rowCount × rowHeight        ← sets scrollbar range
startRow      = floor(scrollTop / rowHeight) - OVERSCAN
endRow        = startRow + visibleRowCount + OVERSCAN
offsetY       = startRow × rowHeight        ← positions rendered rows correctly
```

The spacer div holds the full `totalHeight` to keep the scrollbar accurate. The rendered rows are shifted into position using `translateY(offsetY)`. On resize, `ResizeObserver` recalculates `containerWidth` → `rowHeight` → all derived values.

## How the Worker Works

`imageProcessor.worker.ts` receives `{ photo, requestId }` or `{ photos, requestId }`:

1. Fetches the image as an `ArrayBuffer`
2. Creates an `ImageBitmap` from the blob
3. Draws it onto an `OffscreenCanvas`
4. Calls `applyWatermark()` from `sharedWatermark.ts` to draw "Celebrare" text using `ctx.fillText`
5. Converts canvas to blob via `convertToBlob()`
6. Posts `{ drawnCanvasBlob, filename, requestId }` back to the main thread

The main thread creates an object URL from the blob, triggers a download anchor click, then revokes the URL.

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Run dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_PICSUM_API_URL` | Picsum Photos base URL |