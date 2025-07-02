import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import MathVisualizationDemo from './components/math/MathVisualizationDemo'
import NumberShapeGallery from './components/math/NumberShapeGallery'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

function App() {
  const [currentView, setCurrentView] = useState<'demo' | 'gallery'>('demo')

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-lg border-b-4 border-primary-200">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  🟡 ShapeLearn
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Math Visualization PoC - See Numbers Come to Life!
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentView('demo')}
                  className={`btn-touch px-6 py-3 rounded-2xl font-semibold transition-all ${
                    currentView === 'demo'
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Math Demo
                </button>
                <button
                  onClick={() => setCurrentView('gallery')}
                  className={`btn-touch px-6 py-3 rounded-2xl font-semibold transition-all ${
                    currentView === 'gallery'
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Shape Gallery
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {currentView === 'demo' ? (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Interactive Math Visualization
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Watch numbers transform into 3D shapes! Pick two numbers and see how they 
                  combine through addition or break apart through subtraction.
                </p>
              </div>
              <MathVisualizationDemo />
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Number Shape Gallery
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Explore how each number has its own unique 3D shape. 
                  Click on any number to see its shape up close!
                </p>
              </div>
              <NumberShapeGallery />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t-4 border-primary-200 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-gray-600 text-lg">
                ShapeLearn PoC - Making Math Visual and Fun for Kids Ages 5-10
              </p>
              <p className="text-gray-500 mt-2">
                Built with React + Three.js + Love ❤️
              </p>
            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  )
}

export default App 