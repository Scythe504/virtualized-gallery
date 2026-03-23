import type { Photo } from "../hooks/useFetchPhotos";
import { applyWatermark } from "../utils/sharedWatermark";

export interface WorkerMessage {
  photo?: Photo;
  photos?: Photo[];
  requestId: string;
}

self.onmessage = async (ev) => {
  const { photo, photos, requestId }: WorkerMessage = ev.data

  if (photo) {
    DrawAndReturnWatermarkedImage(photo, requestId);
  }

  if (photos) {
    await Promise.all([photos.map(p => DrawAndReturnWatermarkedImage(p, requestId))])
  }
}

async function DrawAndReturnWatermarkedImage(photo: Photo, requestId: string) {
  const imageArrayBuffer = await (await fetch(`https://picsum.photos/id/${photo.id}/800/800`)).arrayBuffer()
  const blob = new Blob([imageArrayBuffer])

  const imageBitMap = await createImageBitmap(blob)

  const offscreenCanvas = new OffscreenCanvas(imageBitMap.width, imageBitMap.height);

  const ctx = offscreenCanvas.getContext('2d')

  ctx?.drawImage(imageBitMap, 0, 0)

  applyWatermark(ctx!, offscreenCanvas.width, offscreenCanvas.height)

  const drawnCanvasBlob = await offscreenCanvas.convertToBlob()

  postMessage({ drawnCanvasBlob, filename: `celebrare-${photo.id}.jpg`, requestId })
}