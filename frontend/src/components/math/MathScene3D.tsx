import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import NumberShape3D from './NumberShape3D'
import { NumberShape, CompoundShape } from '../../types/math'

interface MathScene3DProps {
  operand1Shape?: NumberShape | CompoundShape
  operand2Shape?: NumberShape | CompoundShape
  resultShape?: NumberShape | CompoundShape
  operation: 'addition' | 'subtraction'
  showResult: boolean
  isAnimating: boolean
  animationPhase: 'initial' | 'moving' | 'linking' | 'morphing' | 'result'
}

const MathScene3D: React.FC<MathScene3DProps> = ({
  operand1Shape,
  operand2Shape,
  resultShape,
  showResult,
  isAnimating,
  animationPhase
}) => {
  // Calculate positions based on animation phase
  const getShapePositions = () => {
    switch (animationPhase) {
      case 'initial':
        return {
          operand1: [-4, 0, 0] as [number, number, number],
          operand2: [4, 0, 0] as [number, number, number],
          result: [0, -4, 0] as [number, number, number]
        }
      case 'moving':
        return {
          operand1: [-2, 0, 0] as [number, number, number],
          operand2: [2, 0, 0] as [number, number, number],
          result: [0, -4, 0] as [number, number, number]
        }
      case 'linking':
        return {
          operand1: [-1, 0, 0] as [number, number, number],
          operand2: [1, 0, 0] as [number, number, number],
          result: [0, -2, 0] as [number, number, number]
        }
      case 'morphing':
        return {
          operand1: [-0.5, 0, 0] as [number, number, number],
          operand2: [0.5, 0, 0] as [number, number, number],
          result: [0, 0, 0] as [number, number, number]
        }
      case 'result':
        return {
          operand1: [-3, 0, 0] as [number, number, number],
          operand2: [1, 0, 0] as [number, number, number],
          result: [0, 0, 0] as [number, number, number]
        }
      default:
        return {
          operand1: [-3, 0, 0] as [number, number, number],
          operand2: [1, 0, 0] as [number, number, number],
          result: [5, 0, 0] as [number, number, number]
        }
    }
  }

  const positions = getShapePositions()

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
          <directionalLight position={[-5, -5, 5]} intensity={0.3} />
          
          <group position={[0, 0, 0]}>
            {operand1Shape && (
              <NumberShape3D
                shape={operand1Shape}
                position={positions.operand1}
                animate={true}
                isAnimating={isAnimating}
                animationPhase={animationPhase}
                scale={[1, 1, 1]}
              />
            )}
            
            {operand2Shape && (
              <NumberShape3D
                shape={operand2Shape}
                position={positions.operand2}
                animate={true}
                isAnimating={isAnimating}
                animationPhase={animationPhase}
                scale={[1, 1, 1]}
              />
            )}
            
            {(showResult || animationPhase === 'morphing' || animationPhase === 'result') && resultShape && (
              <NumberShape3D
                shape={resultShape}
                position={positions.result}
                animate={true}
                isAnimating={isAnimating}
                animationPhase={animationPhase}
                scale={animationPhase === 'result' ? [1.3, 1.3, 1.3] : [1, 1, 1]}
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