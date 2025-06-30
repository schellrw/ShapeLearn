import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import NumberShape3D from './NumberShape3D'
import { NumberShape, CompoundShape } from '../../types/math'

interface MathScene3DProps {
  operand1Shape?: NumberShape | CompoundShape
  operand2Shape?: NumberShape | CompoundShape
  resultShape?: NumberShape | CompoundShape
  operand1: number
  operand2: number
  result?: number
  operation: 'addition' | 'subtraction' | null
  showResult: boolean
  isAnimating: boolean
}

const MathScene3D: React.FC<MathScene3DProps> = ({
  operand1Shape,
  operand2Shape,
  resultShape,
  operand1,
  operand2,
  result,
  operation,
  showResult,
  isAnimating
}) => {
  const operationSymbol = operation === 'addition' ? '+' : operation === 'subtraction' ? '−' : ''

  return (
    <div className="math-canvas">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#f8faff', 0)
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} />
          
          <Html center position={[0, 3, 0]}>
            <div className="flex items-center gap-4 text-2xl font-bold bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <span className="text-gray-700">{operand1}</span>
              {operation && <span className="text-gray-500">{operationSymbol}</span>}
              <span className="text-gray-700">{operand2}</span>
              {showResult && result !== undefined && (
                <>
                  <span className="text-gray-500">=</span>
                  <span className="text-green-600">{result}</span>
                </>
              )}
            </div>
          </Html>
          
          <group position={[0, 0, 0]}>
            {operand1Shape && (
              <NumberShape3D
                shape={operand1Shape}
                position={[-3, 0, 0]}
                animate={isAnimating}
                scale={[1, 1, 1]}
              />
            )}
            
            {operand2Shape && (
              <NumberShape3D
                shape={operand2Shape}
                position={[1, 0, 0]}
                animate={isAnimating}
                scale={[1, 1, 1]}
              />
            )}
            
            {showResult && resultShape && (
              <NumberShape3D
                shape={resultShape}
                position={[5, 0, 0]}
                animate={true}
                scale={[1.2, 1.2, 1.2]}
              />
            )}
          </group>
          
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            enableDamping={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
            maxDistance={12}
            minDistance={4}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

const LoadingFallback: React.FC = () => (
  <Html center>
    <div className="text-center p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-2"></div>
      <span className="text-lg text-gray-600">Loading shapes...</span>
    </div>
  </Html>
)

export default MathScene3D 