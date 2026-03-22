import './index.css'
import { useFetchPhotos } from './hooks/useFetchPhotos'
import { VirtualGallery } from './components/virtualized-list'
import Loader from './components/loader'

const apiUrl = import.meta.env.VITE_PICSUM_API_URL

function App() {
  const { photos, loading, error } = useFetchPhotos({ apiUrl, limit: 100 })

  return (
    <main className=" min-h-screen w-full text-black flex flex-col items-center">
      <header className="px-4 lg:px-16 md:px-8 h-20 w-full flex flex-row items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
        <p className='text-3xl font-mono font-semibold'>
          Gallery
        </p>
      </header>
      <div className="px-4 md:px-8 lg:px-16 w-full">
        {loading &&
        <div className='flex items-center justify-center w-full'>
         <Loader />
        </div>
        }
        {error && <p>Failed to load!</p>}
        {!loading && !error && <VirtualGallery photos={photos} />}
      </div>
    </main>
  )
}

export default App
