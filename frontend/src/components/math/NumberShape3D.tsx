import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
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
  const groupRef = useRef<any>(null)

  // Optimized animation - less complex
  useFrame((state) => {
    if (groupRef.current && animate) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
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
                key={`${index}-${component.label}`}
                shape={component.shape}
                position={component.position}
                scale={[0.6, 0.6, 0.6]} // Make components smaller within compound
                animate={animate}
              />
            )
          })}
        </group>
      )
    }

    // Handle single shapes (numbers 0-9)
    const singleShape = shape as NumberShape
    const { type, geometry, color } = singleShape


    return (
      <group
        ref={groupRef}
        position={position}
        scale={scale}
        rotation={rotation}
        onClick={onClick}
      >
        {renderGeometry(type, geometry, color)}
      </group>
    )
  }, [shape, position, scale, rotation, animate, onClick])

  return renderShape
}

// Optimized geometry rendering - shapes that actually look like numbers!
const renderGeometry = (shapeType: string, geometry: any, color: string) => {
  
  switch (shapeType) {
    case 'torus':
      // 0: Perfect circle/ring - this one is good!
      return (
        <mesh>
          <torusGeometry
            args={[
              geometry.radius || 1,
              geometry.tube || 0.4,
              8,
              16,
            ]}
          />
          <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
        </mesh>
      )
    
    case 'cylinder':
      // 1: Tall, thin pillar like the number 1
      return (
        <mesh>
          <boxGeometry args={[0.3, 2.5, 0.3]} />
          <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
        </mesh>
      )
    
    case 'curved_path':
      // 2: Create an S-curve that looks like number 2
      return (
        <group>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[1.2, 0.25, 0.25]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.8, 0]}>
            <boxGeometry args={[1.2, 0.25, 0.25]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[0.5, 0, 0]}>
            <boxGeometry args={[0.25, 1.2, 0.25]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
        </group>
      )
    
    case 'double_curve':
      // 3: Two curves stacked like number 3
      return (
        <group>
          <mesh position={[0, 0.5, 0]}>
            <torusGeometry args={[0.5, 0.15, 6, 12]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <torusGeometry args={[0.5, 0.15, 6, 12]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
        </group>
      )
    
    case 'angular_frame':
      // 4: Open triangle/frame like number 4
      return (
        <group>
          <mesh position={[-0.4, 0, 0]}>
            <boxGeometry args={[0.2, 1.5, 0.2]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.0, 0.2, 0.2]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[0.4, -0.4, 0]}>
            <boxGeometry args={[0.2, 0.7, 0.2]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
        </group>
      )
    
    case 'flag_shape':
      // 5: Rectangle with line like number 5
      return (
        <group>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[1.0, 0.2, 0.2]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[-0.4, 0.2, 0]}>
            <boxGeometry args={[0.2, 1.0, 0.2]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.8, 0.2, 0.2]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <boxGeometry args={[1.0, 0.2, 0.2]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
        </group>
      )
    
    case 'spiral':
      // 6: Circle with tail like number 6
      return (
        <group>
          <mesh position={[0, -0.3, 0]}>
            <torusGeometry args={[0.5, 0.15, 8, 12]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[-0.5, 0.3, 0]}>
            <boxGeometry args={[0.15, 1.0, 0.15]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
        </group>
      )
    
    case 'flag_post':
      // 7: Angular line like number 7
      return (
        <group>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[1.2, 0.2, 0.2]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[0.4, -0.2, 0]}>
            <boxGeometry args={[0.2, 1.4, 0.2]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
        </group>
      )
    
    case 'double_loop':
      // 8: Two circles stacked like number 8
      return (
        <group>
          <mesh position={[0, 0.5, 0]}>
            <torusGeometry args={[0.4, 0.15, 8, 12]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <torusGeometry args={[0.4, 0.15, 8, 12]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
        </group>
      )
    
    case 'curved_tail':
      // 9: Circle with line like number 9
      return (
        <group>
          <mesh position={[0, 0.3, 0]}>
            <torusGeometry args={[0.5, 0.15, 8, 12]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
          <mesh position={[0.5, -0.3, 0]}>
            <boxGeometry args={[0.15, 1.0, 0.15]} />
            <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
          </mesh>
        </group>
      )
    
    default:
      // Default: Simple box
      return (
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color={color} metalness={0.1} roughness={0.4} />
        </mesh>
      )
  }
}

export default NumberShape3D 