import { type Photo, type UseFetchPhotosResult } from "../hooks/useFetchPhotos"
import { ImageCard } from "./image-card"
import Loader from "./loader"

interface GalleryProps {
  pRes: UseFetchPhotosResult;
  favouriteIds: Set<string>
  handleToggle: (photo: Photo) => void;
}

export const Gallery = ({ pRes, favouriteIds, handleToggle }: GalleryProps) => {

  if (pRes.error) return <p>Failed to Load!</p>
  if (pRes.loading) return <div className="flex justify-center items-center h-full">
    <Loader />
  </div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {pRes.photos.map((photo) => (
        <ImageCard
          key={photo.id}
          photo={photo}
          favouriteIds={favouriteIds}
          handleToggle={handleToggle}
        />
      ))}
    </div>
  )
}