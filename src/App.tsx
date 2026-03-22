import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { Button } from './components/button'
import { Gallery } from './components/gallery'
import { HeartIcon } from './components/image-card'
import { SearchBar } from './components/search-bar'
import './index.css'
import { type Photo, useFetchPhotos } from './hooks/useFetchPhotos'

const apiUrl = import.meta.env.VITE_PICSUM_API_URL

interface FavouriteAction {
  type: 'TOGGLE_FAVOURITES';
  payload: Photo;
}

const reducer = (state: Photo[], action: FavouriteAction) => {
  switch (action.type) {
    case 'TOGGLE_FAVOURITES': {
      const exists = state.some(p => p.id === action.payload.id)
      return exists ? state.filter(p => p.id !== action.payload.id) :
        [...state, action.payload]
    };
    default: {
      return state
    }
  }
}

const createInitialFavouritesState = () => {
  const favourites = localStorage.getItem('favourites')

  if (!favourites) return []
  const photos: Photo[] = JSON.parse(favourites)

  return photos
}

function App() {
  const [query, setQuery] = useState('')
  const [viewFavourites, setViewFavourites] = useState(false);
  const [favourites, dispatchFavourite] = useReducer(reducer, [], createInitialFavouritesState);
  const { photos, loading, error } = useFetchPhotos({ apiUrl, limit: 30 })

  const favouriteIds = useMemo(() => {
    return new Set(favourites.map(f => f.id))
  }, [favourites])

  const filteredPhotos = useMemo(() => {
    const base = photos.filter((p) =>
      p.author.toLowerCase().includes(query.toLowerCase())
    )
    return viewFavourites ? base.filter(p => favouriteIds.has(p.id)) : base
  }, [photos, query, viewFavourites, favouriteIds])

  const handleToggle = useCallback((photo: Photo) => {
    dispatchFavourite({ type: "TOGGLE_FAVOURITES", payload: photo })
  }, [])

  const onInputChange = useCallback((value: string) => {
    setQuery(value)
  }, [])

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites))
  }, [favourites])


  return (
    <main className="bg-black min-h-screen w-full text-white flex flex-col items-center">
      <header className="px-4 lg:px-16 md:px-8 h-20 w-full flex flex-row items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
        <p className='text-3xl hidden md:block  font-mono font-semibold'>
          Gallery
        </p>
        <div className='flex flex-row items-center md:justify-end justify-between w-full gap-2'>
          {/* Search-Bar */}
          <SearchBar
            value={query}
            onChange={(value) => onInputChange(value)}
          />
          {/* Toggle for seeing favourites */}
          <Button className='rounded-full p-1 border-2 bg-red-600'
            onClick={() => setViewFavourites(!viewFavourites)}
          >
            <HeartIcon fill={viewFavourites} />
          </Button>
        </div>
      </header>
      <div className="px-4 lg:px-16 md:px-8 min-h-120 flex items-center justify-center">
        <Gallery
          pRes={{
            photos: filteredPhotos,
            loading,
            error,
          }}
          favouriteIds={favouriteIds}
          handleToggle={handleToggle}
        />
      </div>
    </main>
  )
}

export default App
