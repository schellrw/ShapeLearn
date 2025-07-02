import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { NumberShape, CompoundShape } from '../../types/math'

interface NumberShape3DProps {
  shape: NumberShape | CompoundShape
  position?: [number, number, number]
  scale?: [number, number, number]
  rotation?: [number, number, number]
  animate?: boolean
  isAnimating?: boolean
  animationPhase?: 'initial' | 'moving' | 'linking' | 'morphing' | 'result'
  onClick?: () => void
}

const NumberShape3D: React.FC<NumberShape3DProps> = ({
  shape,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  animate = false,
  isAnimating = false,
  animationPhase = 'initial',
  onClick,
}) => {
  const groupRef = useRef<any>(null)

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current && animate && !isAnimating) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  const renderShape = useMemo(() => {
    if (shape.type === 'compound') {
      // Handle compound shapes (numbers 10-20)
      const compoundShape = shape as CompoundShape
      return (
        <group 
          ref={groupRef}
          position={position}
          scale={scale}
          rotation={rotation}
        >
          {compoundShape.components.map((component, index) => {
            if (!component) return null
            
            return (
              <NumberShape3D
                key={`${index}-${component.label}`}
                shape={component.shape}
                position={component.position}
                scale={[0.8, 0.8, 0.8]} // Better scaling for compound numbers
                animate={animate}
                isAnimating={isAnimating}
                animationPhase={animationPhase}
              />
            )
          })}
        </group>
      )
    }

    // Handle single shapes (numbers 0-9)
    const singleShape = shape as NumberShape
    const { color } = singleShape

    // Extract number from shape data or position context
    const numberValue = extractNumberFromShape(singleShape)

    return (
      <group 
        ref={groupRef}
        position={position}
        scale={scale}
        rotation={rotation}
        onClick={onClick}
      >
        {renderFallbackGeometry(numberValue, color)}
      </group>
    )
  }, [shape, position, scale, rotation, animate, isAnimating, animationPhase, onClick])

  return renderShape
}

// Extract number value from shape context
const extractNumberFromShape = (shape: NumberShape): number => {
  // Try to extract from shape type or description
  if (shape.type.includes('0') || shape.description.includes('0')) return 0
  if (shape.type.includes('1') || shape.description.includes('1')) return 1
  if (shape.type.includes('2') || shape.description.includes('2')) return 2
  if (shape.type.includes('3') || shape.description.includes('3')) return 3
  if (shape.type.includes('4') || shape.description.includes('4')) return 4
  if (shape.type.includes('5') || shape.description.includes('5')) return 5
  if (shape.type.includes('6') || shape.description.includes('6')) return 6
  if (shape.type.includes('7') || shape.description.includes('7')) return 7
  if (shape.type.includes('8') || shape.description.includes('8')) return 8
  if (shape.type.includes('9') || shape.description.includes('9')) return 9
  
  // Fallback mapping based on shape type
  const typeMap: { [key: string]: number } = {
    'torus': 0,
    'cylinder': 1,
    'curved_path': 2,
    'double_curve': 3,
    'angular_frame': 4,
    'flag_shape': 5,
    'spiral': 6,
    'flag_post': 7,
    'double_torus': 8,
    'spiral_dot': 9
  }
  
  return typeMap[shape.type] || 0
}



// Fallback shapes that actually look like numbers (improved versions)
const renderFallbackGeometry = (number: number, color: string) => {
  const commonMaterial = (
    <meshStandardMaterial 
      color={color} 
      metalness={0.1} 
      roughness={0.4}
      emissive={color}
      emissiveIntensity={0.05}
    />
  )

  switch (number) {
    case 0:
      // Oval shape, not perfect circle
      return (
        <mesh>
          <torusGeometry args={[1, 0.3, 8, 16]} />
          <group scale={[1, 1.3, 1]}>
            {commonMaterial}
          </group>
        </mesh>
      )
    
    case 1:
      // Tall, centered pillar
      return (
        <mesh>
          <boxGeometry args={[0.3, 2.4, 0.3]} />
          {commonMaterial}
        </mesh>
      )
    
    case 2:
      // Proper 2 shape with curves
      return (
        <group>
          {/* Top curve */}
          <mesh position={[0.2, 0.8, 0]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.4, 0.15, 6, 12, Math.PI]} />
            {commonMaterial}
          </mesh>
          {/* Diagonal stroke */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[1.2, 0.2, 0.2]} />
            {commonMaterial}
          </mesh>
          {/* Bottom line */}
          <mesh position={[0, -0.8, 0]}>
            <boxGeometry args={[1.2, 0.2, 0.2]} />
            {commonMaterial}
          </mesh>
        </group>
      )
    
    case 3:
      // Proper 3 with open curves on the right
      return (
        <group>
          {/* Top half-circle */}
          <mesh position={[0, 0.5, 0]} rotation={[0, 0, -Math.PI/2]}>
            <torusGeometry args={[0.4, 0.15, 6, 12, Math.PI]} />
            {commonMaterial}
          </mesh>
          {/* Bottom half-circle */}
          <mesh position={[0, -0.5, 0]} rotation={[0, 0, -Math.PI/2]}>
            <torusGeometry args={[0.4, 0.15, 6, 12, Math.PI]} />
            {commonMaterial}
          </mesh>
        </group>
      )
    
    case 4:
      // Proper 4 with correct orientation
      return (
        <group>
          {/* Left vertical */}
          <mesh position={[-0.3, 0.2, 0]}>
            <boxGeometry args={[0.2, 1.2, 0.2]} />
            {commonMaterial}
          </mesh>
          {/* Horizontal bar */}
          <mesh position={[0.1, 0, 0]}>
            <boxGeometry args={[0.8, 0.2, 0.2]} />
            {commonMaterial}
          </mesh>
          {/* Right vertical (shorter) */}
          <mesh position={[0.5, -0.4, 0]}>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
            {commonMaterial}
          </mesh>
        </group>
      )
    
    case 5:
      // Proper 5 shape (not like E)
      return (
        <group>
          {/* Top horizontal */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[1.0, 0.2, 0.2]} />
            {commonMaterial}
          </mesh>
          {/* Left vertical (top half) */}
          <mesh position={[-0.4, 0.4, 0]}>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
            {commonMaterial}
          </mesh>
          {/* Middle horizontal */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.8, 0.2, 0.2]} />
            {commonMaterial}
          </mesh>
          {/* Bottom curve */}
          <mesh position={[0.2, -0.4, 0]} rotation={[0, 0, Math.PI/2]}>
            <torusGeometry args={[0.4, 0.15, 6, 12, Math.PI]} />
            {commonMaterial}
          </mesh>
        </group>
      )
    
    case 6:
      // Spiral/circle with proper 6 shape
      return (
        <group>
          {/* Top curve */}
          <mesh position={[-0.2, 0.4, 0]} rotation={[0, 0, Math.PI/4]}>
            <torusGeometry args={[0.3, 0.15, 6, 12, Math.PI]} />
            {commonMaterial}
          </mesh>
          {/* Bottom circle */}
          <mesh position={[0, -0.3, 0]}>
            <torusGeometry args={[0.4, 0.15, 8, 16]} />
            {commonMaterial}
          </mesh>
        </group>
      )
    
    case 7:
      // Clean 7 shape
      return (
        <group>
          {/* Top horizontal */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[1.0, 0.2, 0.2]} />
            {commonMaterial}
          </mesh>
          {/* Diagonal stroke */}
          <mesh position={[0.1, 0, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.2, 1.6, 0.2]} />
            {commonMaterial}
          </mesh>
        </group>
      )
    
    case 8:
      // Proper figure-8 with two separate circles
      return (
        <group>
          {/* Top circle */}
          <mesh position={[0, 0.5, 0]}>
            <torusGeometry args={[0.35, 0.15, 8, 12]} />
            {commonMaterial}
          </mesh>
          {/* Bottom circle */}
          <mesh position={[0, -0.5, 0]}>
            <torusGeometry args={[0.35, 0.15, 8, 12]} />
            {commonMaterial}
          </mesh>
        </group>
      )
    
    case 9:
      // 6 upside down
      return (
        <group rotation={[Math.PI, 0, 0]}>
          {/* Top curve */}
          <mesh position={[-0.2, 0.4, 0]} rotation={[0, 0, Math.PI/4]}>
            <torusGeometry args={[0.3, 0.15, 6, 12, Math.PI]} />
            {commonMaterial}
          </mesh>
          {/* Bottom circle */}
          <mesh position={[0, -0.3, 0]}>
            <torusGeometry args={[0.4, 0.15, 8, 16]} />
            {commonMaterial}
          </mesh>
        </group>
      )
    
    default:
      // Fallback shape
      return (
        <mesh>
          <boxGeometry args={[0.8, 1.2, 0.3]} />
          {commonMaterial}
        </mesh>
      )
  }
}

export default NumberShape3D 