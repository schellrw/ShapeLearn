import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import NumberShape3D from './NumberShape3D'
import { getAllShapes } from '../../services/mathApi'
import { NumberShape, CompoundShape } from '../../types/math'

const NumberShapeGallery: React.FC = () => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [hoveredNumber, setHoveredNumber] = useState<number | null>(null)

  // Fetch all shapes
  const { data: allShapes, isLoading, error } = useQuery(
    'allShapes',
    getAllShapes
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="loading-spinner w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-6"></div>
          <p className="text-2xl text-gray-600">Loading shape gallery...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😞</div>
        <p className="text-xl text-gray-600">
          Oops! We couldn't load the shapes. Try refreshing the page.
        </p>
      </div>
    )
  }

  const numbers = Array.from({ length: 21 }, (_, i) => i) // 0-20

  const handleNumberClick = (num: number) => {
    // Fix the persistent selection bug
    setSelectedNumber(current => current === num ? null : num)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Number grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-4 mb-8">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            onMouseEnter={() => setHoveredNumber(num)}
            onMouseLeave={() => setHoveredNumber(null)}
            className={`aspect-square rounded-2xl font-bold text-2xl transition-all duration-300 shadow-lg ${
              selectedNumber === num
                ? 'bg-primary-500 text-white scale-110 shadow-2xl'
                : hoveredNumber === num
                ? 'bg-primary-100 text-primary-700 scale-105 shadow-xl'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Shape details */}
      {selectedNumber !== null && allShapes && allShapes[selectedNumber] && (
        <div className="card-child">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 3D Preview */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Shape for Number {selectedNumber}
              </h3>
              
              <div className="aspect-square bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-inner overflow-hidden">
                <ErrorBoundary fallback={() => <WebGLErrorFallback />}>
                  <Canvas 
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    gl={{ 
                      antialias: true, 
                      alpha: true,
                      powerPreference: "high-performance",
                      failIfMajorPerformanceCaveat: false
                    }}
                    key={selectedNumber} // Force remount when number changes
                  >
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 5]} intensity={0.8} />
                    <pointLight position={[-10, -10, -5]} intensity={0.4} />
                    
                    <Environment preset="city" />
                    
                    <NumberShape3D
                      shape={allShapes[selectedNumber]}
                      position={[0, 0, 0]}
                      animate={true}
                      scale={[1.5, 1.5, 1.5]}
                    />
                    
                    <OrbitControls
                      enablePan={false}
                      enableZoom={true}
                      enableRotate={true}
                      autoRotate={true}
                      autoRotateSpeed={2}
                    />
                  </Canvas>
                </ErrorBoundary>
              </div>
            </div>

            {/* Shape information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                About This Shape
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Description:</span>{' '}
                    {allShapes[selectedNumber].description}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Shape Type:</span>{' '}
                    {allShapes[selectedNumber].type === 'compound' ? 'Compound Shape' : 'Single Shape'}
                  </p>
                  {allShapes[selectedNumber].type === 'compound' && (
                    <p className="text-md text-gray-600 mt-2">
                      This number combines multiple shapes to represent tens and ones!
                    </p>
                  )}
                </div>

                {/* Complementary pair info */}
                {selectedNumber > 0 && selectedNumber < 10 && (
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <p className="text-lg text-gray-700">
                      <span className="font-semibold">Complementary Friend:</span>{' '}
                      {10 - selectedNumber}
                    </p>
                    <p className="text-md text-gray-600 mt-2">
                      {selectedNumber} + {10 - selectedNumber} = 10. They're math buddies!
                    </p>
                  </div>
                )}

                {/* Fun facts */}
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-lg text-gray-700 font-semibold mb-2">
                    Fun Facts:
                  </p>
                  <ul className="text-md text-gray-600 space-y-1">
                    {selectedNumber === 0 && (
                      <>
                        <li>• Zero represents "nothing" but it's shaped like a complete circle!</li>
                        <li>• It's the only number that looks the same as its shape!</li>
                      </>
                    )}
                    {selectedNumber === 1 && (
                      <>
                        <li>• One is tall and proud, standing all by itself!</li>
                        <li>• It's the loneliest number, but also the strongest!</li>
                      </>
                    )}
                    {selectedNumber === 5 && (
                      <>
                        <li>• Five is right in the middle - it's everyone's friend!</li>
                        <li>• It's shaped like a flag because it marks the halfway point!</li>
                      </>
                    )}
                    {selectedNumber === 10 && (
                      <>
                        <li>• Ten is our first big number - it has two parts!</li>
                        <li>• It's made by combining 1 and 0 together!</li>
                      </>
                    )}
                    {selectedNumber > 10 && (
                      <>
                        <li>• This is a two-digit number with tens and ones!</li>
                        <li>• Can you see how it's built from smaller numbers?</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Interactive hints */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-md text-gray-600">
                    💡 <span className="font-semibold">Tip:</span> Try dragging to rotate the shape, 
                    or scroll to zoom in and out. See how it moves and changes!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <div className="text-center mt-8">
            <button
              onClick={() => setSelectedNumber(null)}
              className="btn-secondary px-8"
            >
              ← Back to Gallery
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {selectedNumber === null && (
        <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl">
          <div className="text-4xl mb-4">👆</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Click on any number above!
          </h3>
          <p className="text-lg text-gray-600">
            Explore how each number has its own unique 3D shape. 
            See how they're designed to help you understand math better!
          </p>
        </div>
      )}
    </div>
  )
}

// Error boundary for WebGL issues
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: () => JSX.Element },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('WebGL Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback()
    }

    return this.props.children
  }
}

// Fallback component when WebGL fails
const WebGLErrorFallback: React.FC = () => (
  <div className="aspect-square bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl shadow-inner flex items-center justify-center">
    <div className="text-center p-8">
      <div className="text-6xl mb-4">🎨</div>
      <p className="text-lg text-gray-600 mb-2">3D view not available</p>
      <p className="text-sm text-gray-500">
        Your browser might not support 3D graphics, but the shapes are still here!
      </p>
    </div>
  </div>
)

export default NumberShapeGallery 