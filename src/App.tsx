import { Gallery } from './components/gallery'
import './index.css'
import { useFetchPhotos } from './hooks/useFetchPhotos'

const apiUrl = import.meta.env.VITE_PICSUM_API_URL

function App() {
  const { photos, loading, error } = useFetchPhotos({ apiUrl, limit: 30 })

  return (
    <main className="bg-black min-h-screen w-full text-white flex flex-col items-center">
      <header className="px-4 lg:px-16 md:px-8 h-20 w-full flex flex-row items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
        <p className='text-3xl font-mono font-semibold'>
          Gallery
        </p>
      </header>
      <div className="px-4 lg:px-16 md:px-8 min-h-120 flex items-center justify-center">
        <Gallery
          pRes={{
            photos: photos,
            loading,
            error,
          }}
        />
      </div>
    </main>
  )
}

export default App
