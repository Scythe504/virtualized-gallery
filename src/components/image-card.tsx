import type { Photo } from "../hooks/useFetchPhotos";

interface ImageCardProps {
  photo: Photo;
}

export const ImageCard = ({ photo }: ImageCardProps) => {

  return <div className="rounded-sm flex flex-col relative overflow-clip aspect-square focus:shadow-md shadow-zinc-700 shadow-sm hover:scale-105 transition-transform duration-300 ease-in-out">
    {/* Header - By: <AUTHOR_NAME> */}
    <div className="absolute top-0 left-0 right-0">
      <p className="mx-2">
        By: {photo.author}
      </p>
    </div>
    <div className="h-full flex items-center">
      <img
        src={photo.download_url}
        height={photo.height}
        width={photo.width}
      />
    </div>
  </div>
}