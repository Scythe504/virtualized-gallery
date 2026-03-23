import { useEffect, useState } from "react";
import { getPhotosFromCache, savePhotosToCache } from "../utils/indexedDB";

export interface Photo {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
  isCached?: boolean;
  sortOrder?: number; // Preserve the API's visual order
}

export type UseFetchPhotosResult = {
  photos: Photo[];
  loading: boolean;
  error: string | null;
}

interface UseFetchPhotosProps {
  apiUrl: string;
  limit: number;
}

export function useFetchPhotos({ apiUrl, limit }: UseFetchPhotosProps): UseFetchPhotosResult {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPhotos = async () => {
      // Load from Cache first for instant UI
      const cachedPhotos = await getPhotosFromCache();

      if (cachedPhotos && cachedPhotos.length > 0) {
        if (isMounted) {
          console.log("Index DB cache metadata hit")
          const sortedCache = [...cachedPhotos].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
          setPhotos(sortedCache.map(p => ({ ...p, isCached: true })));
          setLoading(false);
        }
      }

      // Fetch fresh data in background
      try {
        const response = await fetch(`${apiUrl}/list?limit=${limit}`);
        if (!response.ok) throw new Error("Failed to load from API");
        const freshData: Photo[] = await response.json();

        // Assign a sortOrder based on the current API sequence
        const dataWithOrder = freshData.map((p, index) => ({ ...p, sortOrder: index }));

        if (isMounted) {
          setPhotos((prevPhotos) => {
            // If no cache present simply add all dataWithOrder into the photos state
            if (!prevPhotos.length) return dataWithOrder;

            // Merge logic to prevent UI jump if data length/ids are the same
            const prevMap = new Map(prevPhotos.map(p => [p.id, p]));
            const merged = dataWithOrder.map(freshItem => {
              const cachedItem = prevMap.get(freshItem.id);
              // Maintain flags and order consistency
              return { ...cachedItem, ...freshItem, isCached: true };
            });

            return merged;
          });
        }

        // Save fresh metadata (with order)
        await savePhotosToCache(dataWithOrder);

      } catch (err) {
        if (isMounted && (!cachedPhotos || cachedPhotos.length === 0)) {
          setError(err instanceof Error ? err.message : "Unknown Error");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPhotos();

    return () => {
      isMounted = false;
    };
  }, [apiUrl, limit]);

  return { photos, loading, error };
}
