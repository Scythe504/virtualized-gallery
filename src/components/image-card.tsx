import type { Photo } from "../hooks/useFetchPhotos"

interface ImageCardProps {
  photo: Photo
}

export const ImageCard = ({ photo }: ImageCardProps) => {
  const thumbUrl = `https://picsum.photos/id/${photo.id}/400/400`
  return (
    <div className="relative overflow-hidden aspect-square w-full rounded-sm shadow-sm shadow-zinc-700 hover:scale-102 transition-transform duration-300 ease-in-out">
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <p className="mx-2 py-1 text-sm truncate text-white">
          By: {photo.author}
        </p>
      </div>
      <img
        src={thumbUrl}
        alt={photo.author}
        height={400}
        width={400}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  )
}