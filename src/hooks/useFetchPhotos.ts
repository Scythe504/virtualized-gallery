import { useEffect, useState } from "react";

export interface Photo {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
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
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${apiUrl}/list?limit=${limit}`);
        if (!response.ok) throw new Error("Failed to load!");
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown Error");
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, [])

  return { photos, loading, error }
}