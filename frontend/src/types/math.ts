export interface ShapeGeometry {
  [key: string]: any
}

export interface NumberShape {
  type: string
  geometry: ShapeGeometry
  color: string
  position: [number, number, number]
  scale: [number, number, number]
  description: string
  connection_points?: string[]
}

export interface CompoundShape {
  type: 'compound'
  components: Array<{
    shape: NumberShape
    position: [number, number, number]
    label: string
  } | null>
  color: string
  description: string
}

export interface TransformationStep {
  step: number
  description: string
  animation: string
  duration: number
  shapes: {
    [key: string]: {
      position?: [number, number, number]
      rotation?: [number, number, number]
      scale?: [number, number, number]
    }
  }
}

export interface MathTransformation {
  type: 'addition' | 'subtraction'
  operand1: number
  operand2: number
  result: number
  is_complementary: boolean
  steps: TransformationStep[]
}

export interface MathOperation {
  success: boolean
  operation: string
  operand1: number
  operand2: number
  result: number
  transformation: MathTransformation
  equation: string
}

export interface PracticeProblem {
  id: string
  operand1: number
  operand2: number
  operation: 'addition' | 'subtraction'
  result: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
} 