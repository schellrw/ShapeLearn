import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'
import { NumberShape, CompoundShape } from '../../types/math'

interface NumberShape3DProps {
  shape: NumberShape | CompoundShape
  position?: [number, number, number]
  scale?: [number, number, number]
  rotation?: [number, number, number]
  animate?: boolean
  onClick?: () => void
}

const NumberShape3D: React.FC<NumberShape3DProps> = ({
  shape,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  animate = false,
  onClick,
}) => {
  const meshRef = useRef<Mesh>(null)

  // Gentle rotation animation for engagement
  useFrame((state) => {
    if (meshRef.current && animate) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  const renderShape = useMemo(() => {
    if (shape.type === 'compound') {
      // Handle compound shapes (numbers 10-20)
      const compoundShape = shape as CompoundShape
      return (
        <group position={position} scale={scale} rotation={rotation}>
          {compoundShape.components.map((component, index) => {
            if (!component) return null
            return (
              <NumberShape3D
                key={index}
                shape={component.shape}
                position={component.position}
                animate={animate}
              />
            )
          })}
        </group>
      )
    }

    // Handle single shapes (numbers 0-9)
    const singleShape = shape as NumberShape
    const { geometry, color } = singleShape

    return (
      <mesh
        ref={meshRef}
        position={position}
        scale={scale}
        rotation={rotation}
        onClick={onClick}
      >
        {renderGeometry(geometry)}
        <meshStandardMaterial color={color} />
      </mesh>
    )
  }, [shape, position, scale, rotation, animate, onClick])

  return renderShape
}

// Helper function to render different geometry types
const renderGeometry = (geometry: any) => {
  switch (geometry.type) {
    case 'torus':
      return (
        <torusGeometry
          args={[
            geometry.radius || 1,
            geometry.tube || 0.4,
            geometry.radialSegments || 8,
            geometry.tubularSegments || 16,
          ]}
        />
      )
    
    case 'cylinder':
      return (
        <cylinderGeometry
          args={[
            geometry.radiusTop || 0.5,
            geometry.radiusBottom || 0.5,
            geometry.height || 1,
            geometry.radialSegments || 8,
          ]}
        />
      )
    
    case 'curved_path':
    case 'double_curve':
      // For complex curves, use a torus as approximation
      return <torusGeometry args={[0.8, 0.3, 8, 16]} />
    
    case 'angular_frame':
      return (
        <boxGeometry
          args={[
            geometry.width || 1,
            geometry.height || 1,
            geometry.thickness || 0.2,
          ]}
        />
      )
    
    case 'flag_shape':
    case 'flag_post':
      return <boxGeometry args={[1.2, 2, 0.25]} />
    
    case 'spiral':
      return <torusGeometry args={[1, 0.3, 8, 16]} />
    
    case 'double_loop':
      return <torusGeometry args={[0.7, 0.3, 8, 16]} />
    
    case 'curved_tail':
      return <sphereGeometry args={[0.8, 8, 8]} />
    
    default:
      // Default fallback
      return <boxGeometry args={[1, 1, 1]} />
  }
}

export default NumberShape3D 