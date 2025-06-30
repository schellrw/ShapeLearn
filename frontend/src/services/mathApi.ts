import axios from 'axios'
import { NumberShape, CompoundShape, MathOperation, PracticeProblem } from '../types/math'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
    console.error('Failed to fetch all shapes:', error)
    throw error
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
    console.error(`Failed to fetch shape for number ${number}:`, error)
    throw error
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
    console.error('Failed to calculate operation:', error)
    throw error
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
    console.error('Failed to generate practice problems:', error)
    throw error
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