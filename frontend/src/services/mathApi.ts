import axios from 'axios'
import { NumberShape, CompoundShape, MathOperation, PracticeProblem } from '../types/math'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Mock data for when backend is not available
const getMockShapes = (): Record<number, NumberShape | CompoundShape> => {
  const shapes: Record<number, NumberShape | CompoundShape> = {}
  
  // Single digit shapes (0-9)
  const singleShapes = [
    { type: 'torus', color: '#FF6B6B', description: 'A complete circle representing wholeness and zero' },
    { type: 'cylinder', color: '#4ECDC4', description: 'A tall pillar representing unity and singularity' },
    { type: 'curved_path', color: '#45B7D1', description: 'A curved path with flowing lines' },
    { type: 'double_curve', color: '#96CEB4', description: 'Two curved sections that interlock' },
    { type: 'angular_frame', color: '#FECA57', description: 'An angular, structural frame' },
    { type: 'flag_shape', color: '#FF9FF3', description: 'A flag-like shape with horizontal and vertical elements' },
    { type: 'spiral', color: '#54A0FF', description: 'A spiral that can nestle with other curved numbers' },
    { type: 'flag_post', color: '#5F27CD', description: 'An angular flag that can invert and connect' },
    { type: 'double_loop', color: '#00D2D3', description: 'Two connected loops that can interlock' },
    { type: 'curved_tail', color: '#FF6B6B', description: 'A curved head with flowing tail' }
  ]
  
  const geometryParams = [
    { radius: 1.2, tube: 0.4, radialSegments: 16, tubularSegments: 32 }, // torus
    { radiusTop: 0.2, radiusBottom: 0.3, height: 2.5 }, // cylinder
    { points: [[0, 1, 0], [1, 1, 0], [1, 0, 0], [0, 0, 0], [1, 0, 0]], thickness: 0.3 }, // curved_path
    { curves: 2, radius: 0.8, thickness: 0.3 }, // double_curve
    { width: 1.5, height: 2, thickness: 0.2 }, // angular_frame
    { pole_height: 2, flag_width: 1.2, thickness: 0.25 }, // flag_shape
    { radius: 1, turns: 1.5, thickness: 0.3 }, // spiral
    { pole_height: 2.2, flag_width: 1.4, angle: 45 }, // flag_post
    { loops: 2, radius: 0.7, thickness: 0.3 }, // double_loop
    { head_radius: 0.8, tail_length: 1.5, thickness: 0.3 } // curved_tail
  ]

  // Helper function to create a fresh shape object
  const createShapeObject = (index: number): NumberShape => ({
    type: singleShapes[index].type,
    geometry: { ...geometryParams[index] },
    color: singleShapes[index].color,
    position: [0, 0, 0] as [number, number, number],
    scale: [1, 1, 1] as [number, number, number],
    description: singleShapes[index].description
  })

  // Create single digit shapes (0-9)
  for (let i = 0; i <= 9; i++) {
    shapes[i] = createShapeObject(i)
  }
  
  // Create compound shapes (10-20) without circular references
  for (let i = 10; i <= 20; i++) {
    const tens = Math.floor(i / 10)
    const ones = i % 10
    
    const components: Array<{
      shape: NumberShape
      position: [number, number, number]
      label: string
    } | null> = [
      {
        shape: createShapeObject(tens), // Create fresh object
        position: [-1.5, 0, 0] as [number, number, number],
        label: 'tens'
      }
    ]
    
    if (ones > 0) {
      components.push({
        shape: createShapeObject(ones), // Create fresh object
        position: [1.5, 0, 0] as [number, number, number],
        label: 'ones'
      })
    } else {
      components.push(null)
    }
    
    shapes[i] = {
      type: 'compound',
      components,
      color: '#A8E6CF',
      description: `Compound number combining ${tens} and ${ones}`
    }
  }
  
  return shapes
}

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    console.error('Health check failed:', error)
    throw error
  }
}

// Get all number shapes (0-20)
export const getAllShapes = async (): Promise<Record<number, NumberShape | CompoundShape>> => {
  try {
    const response = await api.get('/api/shapes')
    if (response.data.success) {
      return response.data.shapes
    }
    throw new Error(response.data.error || 'Failed to fetch shapes')
  } catch (error) {
    console.warn('Backend not available, using mock data:', error)
    return getMockShapes()
  }
}

// Get shape for specific number
export const getNumberShape = async (number: number): Promise<NumberShape | CompoundShape> => {
  try {
    const response = await api.get(`/api/shapes/${number}`)
    if (response.data.success) {
      return response.data.shape
    }
    throw new Error(response.data.error || 'Failed to fetch shape')
  } catch (error) {
    console.warn(`Backend not available for number ${number}, using mock data:`, error)
    const mockShapes = getMockShapes()
    if (mockShapes[number]) {
      return mockShapes[number]
    }
    throw new Error(`No shape available for number ${number}`)
  }
}

// Calculate math operation
export const calculateOperation = async (
  operation: 'addition' | 'subtraction',
  operand1: number,
  operand2: number
): Promise<MathOperation> => {
  try {
    const response = await api.post('/api/operation', {
      operation,
      operand1,
      operand2,
    })
    
    if (response.data.success) {
      return response.data
    }
    throw new Error(response.data.error || 'Failed to calculate operation')
  } catch (error) {
    console.warn('Backend not available for operation, using mock calculation:', error)
    
    // Mock calculation
    const result = operation === 'addition' ? operand1 + operand2 : operand1 - operand2
    const isComplementary = operation === 'addition' && operand1 + operand2 === 10
    
    return {
      success: true,
      operation,
      operand1,
      operand2,
      result,
      transformation: {
        type: operation,
        operand1,
        operand2,
        result,
        is_complementary: isComplementary,
        steps: [
          {
            step: 1,
            description: `${operand1} ${operation === 'addition' ? '+' : '-'} ${operand2} = ${result}`,
            animation: 'simple_calculation',
            duration: 1000,
            shapes: {}
          }
        ]
      },
      equation: `${operand1} ${operation === 'addition' ? '+' : '-'} ${operand2} = ${result}`
    }
  }
}

// Generate practice problems
export const generatePracticeProblems = async (
  skillLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  operationType: 'addition' | 'subtraction' = 'addition',
  count: number = 5
): Promise<PracticeProblem[]> => {
  try {
    const response = await api.post('/api/practice', {
      skill_level: skillLevel,
      operation_type: operationType,
      count,
    })
    
    if (response.data.success) {
      return response.data.problems
    }
    throw new Error(response.data.error || 'Failed to generate practice problems')
  } catch (error) {
    console.warn('Backend not available for practice problems, using mock data:', error)
    
    // Generate mock practice problems
    const problems: PracticeProblem[] = []
    for (let i = 0; i < count; i++) {
      const operand1 = Math.floor(Math.random() * 10) + 1
      const operand2 = Math.floor(Math.random() * 10) + 1
      problems.push({
        id: `mock-${i}`,
        operand1,
        operand2,
        operation: operationType,
        result: operationType === 'addition' ? operand1 + operand2 : Math.abs(operand1 - operand2),
        difficulty: skillLevel === 'beginner' ? 'easy' : skillLevel === 'intermediate' ? 'medium' : 'hard'
      })
    }
    return problems
  }
}

// Error handling utility
export const isApiError = (error: any): boolean => {
  return error.response && error.response.data && !error.response.data.success
}

export const getApiErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    return error.response.data.error || 'An API error occurred'
  }
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
} 