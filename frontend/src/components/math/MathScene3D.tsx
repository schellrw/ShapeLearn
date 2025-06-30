import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Text, Html } from '@react-three/drei'
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
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <Suspense fallback={<LoadingFallback />}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <pointLight position={[-10, -10, -5]} intensity={0.4} />
          
          {/* Environment for better reflections */}
          <Environment preset="city" />
          
          {/* Math equation display */}
          <group position={[0, 3, 0]}>
            <Text
              position={[-3, 0, 0]}
              fontSize={0.8}
              color="#374151"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Inter-Bold.woff"
            >
              {operand1}
            </Text>
            
            {operation && (
              <Text
                position={[-1, 0, 0]}
                fontSize={0.8}
                color="#6B7280"
                anchorX="center"
                anchorY="middle"
                font="/fonts/Inter-Bold.woff"
              >
                {operationSymbol}
              </Text>
            )}
            
            <Text
              position={[1, 0, 0]}
              fontSize={0.8}
              color="#374151"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Inter-Bold.woff"
            >
              {operand2}
            </Text>
            
            {showResult && result !== undefined && (
              <>
                <Text
                  position={[3, 0, 0]}
                  fontSize={0.8}
                  color="#6B7280"
                  anchorX="center"
                  anchorY="middle"
                  font="/fonts/Inter-Bold.woff"
                >
                  =
                </Text>
                <Text
                  position={[5, 0, 0]}
                  fontSize={0.8}
                  color="#22C55E"
                  anchorX="center"
                  anchorY="middle"
                  font="/fonts/Inter-Bold.woff"
                >
                  {result}
                </Text>
              </>
            )}
          </group>
          
          {/* Number shapes */}
          <group position={[0, 0, 0]}>
            {/* First operand */}
            {operand1Shape && (
              <NumberShape3D
                shape={operand1Shape}
                position={[-3, 0, 0]}
                animate={isAnimating}
              />
            )}
            
            {/* Second operand */}
            {operand2Shape && (
              <NumberShape3D
                shape={operand2Shape}
                position={[1, 0, 0]}
                animate={isAnimating}
              />
            )}
            
            {/* Result shape */}
            {showResult && resultShape && (
              <NumberShape3D
                shape={resultShape}
                position={[5, 0, 0]}
                animate={true}
                scale={[1.2, 1.2, 1.2]}
              />
            )}
          </group>
          
          {/* Interactive controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
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

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <Html center>
    <div className="flex items-center justify-center p-4">
      <div className="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full"></div>
      <span className="ml-3 text-lg text-gray-600">Loading shapes...</span>
    </div>
  </Html>
)

export default MathScene3D 