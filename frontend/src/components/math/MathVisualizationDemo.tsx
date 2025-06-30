import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import MathScene3D from './MathScene3D'
import { getNumberShape, calculateOperation } from '../../services/mathApi'
import { NumberShape, CompoundShape, MathOperation } from '../../types/math'

const MathVisualizationDemo: React.FC = () => {
  const [operand1, setOperand1] = useState<number>(3)
  const [operand2, setOperand2] = useState<number>(7)
  const [operation, setOperation] = useState<'addition' | 'subtraction'>('addition')
  const [showResult, setShowResult] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [mathResult, setMathResult] = useState<MathOperation | null>(null)

  // Fetch shapes for operands
  const { data: operand1Shape, isLoading: loading1 } = useQuery(
    ['shape', operand1],
    () => getNumberShape(operand1),
    { enabled: operand1 >= 0 && operand1 <= 20 }
  )

  const { data: operand2Shape, isLoading: loading2 } = useQuery(
    ['shape', operand2],
    () => getNumberShape(operand2),
    { enabled: operand2 >= 0 && operand2 <= 20 }
  )

  // Fetch result shape when showing result
  const result = operation === 'addition' ? operand1 + operand2 : operand1 - operand2
  const { data: resultShape, isLoading: loadingResult } = useQuery(
    ['shape', result],
    () => getNumberShape(result),
    { enabled: showResult && result >= 0 && result <= 20 }
  )

  // Calculate operation
  const handleCalculate = async () => {
    try {
      setIsAnimating(true)
      const operationResult = await calculateOperation(operation, operand1, operand2)
      setMathResult(operationResult)
      
      // Show result after animation delay
      setTimeout(() => {
        setShowResult(true)
        setIsAnimating(false)
      }, 1500)
    } catch (error) {
      console.error('Calculation failed:', error)
      setIsAnimating(false)
    }
  }

  // Reset calculation
  const handleReset = () => {
    setShowResult(false)
    setMathResult(null)
    setIsAnimating(false)
  }

  // Preset problems for easy testing
  const presetProblems = [
    { operand1: 3, operand2: 7, operation: 'addition' as const, label: '3 + 7 (Complementary!)' },
    { operand1: 2, operand2: 8, operation: 'addition' as const, label: '2 + 8 (Complementary!)' },
    { operand1: 5, operand2: 4, operation: 'addition' as const, label: '5 + 4' },
    { operand1: 10, operand2: 3, operation: 'subtraction' as const, label: '10 - 3' },
    { operand1: 15, operand2: 7, operation: 'subtraction' as const, label: '15 - 7' },
  ]

  const loadPreset = (preset: typeof presetProblems[0]) => {
    handleReset()
    setOperand1(preset.operand1)
    setOperand2(preset.operand2)
    setOperation(preset.operation)
  }

  const isLoading = loading1 || loading2 || (showResult && loadingResult)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Manual Input */}
        <div className="card-child">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Create Your Own Problem
          </h3>
          
          <div className="space-y-6">
            {/* Number inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  First Number
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={operand1}
                  onChange={(e) => {
                    handleReset()
                    setOperand1(parseInt(e.target.value) || 0)
                  }}
                  className="w-full h-touch px-4 text-xl text-center border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </div>
              
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Second Number
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={operand2}
                  onChange={(e) => {
                    handleReset()
                    setOperand2(parseInt(e.target.value) || 0)
                  }}
                  className="w-full h-touch px-4 text-xl text-center border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>

            {/* Operation selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Operation
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    handleReset()
                    setOperation('addition')
                  }}
                  className={`btn-touch py-3 px-6 rounded-xl font-semibold transition-all ${
                    operation === 'addition'
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ➕ Addition
                </button>
                <button
                  onClick={() => {
                    handleReset()
                    setOperation('subtraction')
                  }}
                  className={`btn-touch py-3 px-6 rounded-xl font-semibold transition-all ${
                    operation === 'subtraction'
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ➖ Subtraction
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCalculate}
                disabled={isLoading || isAnimating}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnimating ? '🎬 Calculating...' : '✨ See the Magic!'}
              </button>
              
              {(showResult || mathResult) && (
                <button
                  onClick={handleReset}
                  className="btn-secondary"
                >
                  🔄 Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preset Problems */}
        <div className="card-child">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Try These Fun Examples!
          </h3>
          
          <div className="space-y-3">
            {presetProblems.map((preset, index) => (
              <button
                key={index}
                onClick={() => loadPreset(preset)}
                className="w-full btn-secondary text-left py-4 px-6 hover:bg-primary-50 hover:border-primary-300"
              >
                <span className="font-semibold text-lg">{preset.label}</span>
                {(preset.operand1 + preset.operand2 === 10 && preset.operation === 'addition') && (
                  <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                    🌟 Makes 10!
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Visualization */}
      <div className="card-child">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            3D Shape Visualization
          </h3>
          {mathResult?.transformation.is_complementary && (
            <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl px-4 py-2">
              <span className="text-yellow-800 font-semibold">
                🌟 Complementary Numbers! They make 10!
              </span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="math-canvas flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="loading-spinner w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-4"></div>
              <p className="text-xl text-gray-600">Loading amazing shapes...</p>
            </div>
          </div>
        ) : (
          <MathScene3D
            operand1Shape={operand1Shape}
            operand2Shape={operand2Shape}
            resultShape={resultShape}
            operand1={operand1}
            operand2={operand2}
            result={result >= 0 ? result : undefined}
            operation={operation}
            showResult={showResult}
            isAnimating={isAnimating}
          />
        )}

        {/* Result display */}
        {showResult && mathResult && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border-2 border-green-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2 celebrate">
                🎉 {mathResult.equation} 🎉
              </div>
              <p className="text-lg text-gray-700">
                Great job! You solved the problem!
              </p>
              {mathResult.transformation.is_complementary && (
                <p className="text-md text-yellow-700 mt-2 font-semibold">
                  ✨ These numbers are best friends - they always add up to 10!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MathVisualizationDemo 