import { useEffect, useState } from "react";
import { type Photo } from "../hooks/useFetchPhotos"
import { previewImageCache } from "../utils/imageCache";

export const PreviewImage = ({ photo }: { photo: Photo }) => {
  const [src, setSrc] = useState<string | null>(previewImageCache.get(photo.id) || null);

  useEffect(() => {
    if (previewImageCache.has(photo.id)) return;

    let isMounted = true;
    const fetchPreview = async () => {
      try {
        const response = await fetch(photo.download_url);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        previewImageCache.set(photo.id, objectUrl);
        if (isMounted) setSrc(objectUrl);
      } catch (e) {
        console.error("Failed to load preview", e);
        if (isMounted) setSrc(photo.download_url);
      }
    };

    fetchPreview();
    return () => { isMounted = false; };
  }, [photo.id, photo.download_url]);


  return (
    <img
      src={src ?? photo.download_url}
      alt={photo.author}
      className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
    />
  );
}