import './index.css'
import { useState } from 'react'
import { useFetchPhotos } from './hooks/useFetchPhotos'
import { VirtualGallery } from './components/virtualized-list'
import Loader from './components/loader'
import { WorkerProvider } from './context/WorkerContext'

const apiUrl = import.meta.env.VITE_PICSUM_API_URL

function App() {
  const { photos, loading, error } = useFetchPhotos({ apiUrl, limit: 1000 })
  const [selectionMode, setSelectionMode] = useState(false)

  return (
    <WorkerProvider>
      <main className="bg-black min-h-screen w-full text-white flex flex-col">
        <header className="px-4 lg:px-16 md:px-8 h-20 w-full flex flex-row items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
          <p className="text-3xl font-mono font-semibold">Gallery</p>
          <button
            onClick={() => setSelectionMode(prev => !prev)}
            className="text-sm px-3 py-1.5 rounded-md border border-zinc-600 hover:border-zinc-400 transition-colors"
          >
            {selectionMode ? "Cancel" : "Select"}
          </button>
        </header>
        <div className="flex-1 px-4 md:px-8 lg:px-16 w-full">
          {loading &&
            <div className="flex items-center justify-center w-full">
              <Loader />
            </div>
          }
          {error && <p>Failed to load!</p>}
          {!loading && !error && (
            <VirtualGallery
              photos={photos}
              selectionMode={selectionMode}
            />
          )}
        </div>
      </main>
    </WorkerProvider>
  )
}

export default App