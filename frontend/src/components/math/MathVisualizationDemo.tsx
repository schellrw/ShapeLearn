import React, { useState } from 'react'
import { useQuery } from 'react-query'
import MathScene3D from './MathScene3D'
import { getNumberShape, calculateOperation } from '../../services/mathApi'
import { MathOperation } from '../../types/math'

const MathVisualizationDemo: React.FC = () => {
  const [operand1, setOperand1] = useState<number>(3)
  const [operand2, setOperand2] = useState<number>(7)
  const [operation, setOperation] = useState<'addition' | 'subtraction'>('addition')
  const [showResult, setShowResult] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'moving' | 'linking' | 'morphing' | 'result'>('initial')
  const [mathResult, setMathResult] = useState<MathOperation | null>(null)
  const [displayEquation, setDisplayEquation] = useState<string>('')

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

  // Enhanced animation sequence
  const handleCalculate = async () => {
    try {
      setIsAnimating(true)
      setAnimationPhase('initial')
      
      // Reset equation display
      const operatorSymbol = operation === 'addition' ? '+' : '-'
      setDisplayEquation(`${operand1} ${operatorSymbol} ${operand2}`)
      
      // Calculate operation
      const operationResult = await calculateOperation(operation, operand1, operand2)
      setMathResult(operationResult)
      
      // Animation sequence with proper timing
      setTimeout(() => {
        setAnimationPhase('moving')
        setDisplayEquation(`${operand1} ${operatorSymbol} ${operand2}`)
      }, 500)
      
      setTimeout(() => {
        setAnimationPhase('linking')
        setDisplayEquation(`${operand1} ${operatorSymbol} ${operand2} =`)
      }, 1200)
      
      setTimeout(() => {
        setAnimationPhase('morphing')
        setDisplayEquation(`${operand1} ${operatorSymbol} ${operand2} = ${result}`)
      }, 1800)
      
      setTimeout(() => {
        setAnimationPhase('result')
        setShowResult(true)
        setIsAnimating(false)
      }, 2500)
      
    } catch (error) {
      console.error('Calculation failed:', error)
      setIsAnimating(false)
      setAnimationPhase('initial')
    }
  }

  // Reset calculation
  const handleReset = () => {
    setShowResult(false)
    setMathResult(null)
    setIsAnimating(false)
    setAnimationPhase('initial')
    setDisplayEquation('')
  }

  // Generate celebration message for complementary numbers
  const getCelebrationMessage = () => {
    if (operation === 'addition' && operand1 + operand2 === 10) {
      return {
        title: "🌟 Complementary Numbers! They make 10!",
        message: `${operand1} and ${operand2} are math buddies - they always add up to 10!`,
        celebration: true
      }
    }
    if (showResult && mathResult) {
      return {
        title: "🎉 Great job! You solved the problem!",
        message: `These numbers are best friends - they always add up to ${result}!`,
        celebration: false
      }
    }
    return null
  }

  // Preset problems for easy testing
  const presetProblems = [
    { operand1: 3, operand2: 7, operation: 'addition' as const, label: '3 + 7 (Complementary!)' },
    { operand1: 2, operand2: 8, operation: 'addition' as const, label: '2 + 8 (Complementary!)' },
    { operand1: 5, operand2: 4, operation: 'addition' as const, label: '5 + 4' },
    { operand1: 1, operand2: 9, operation: 'addition' as const, label: '1 + 9 (Complementary!)' },
    { operand1: 4, operand2: 6, operation: 'addition' as const, label: '4 + 6 (Complementary!)' },
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
  const celebrationMessage = getCelebrationMessage()

  return (
    <div className="max-w-6xl mx-auto">
      {/* Enhanced 3D Visualization */}
      <div className="card-child mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            3D Shape Visualization
          </h2>
          
          {/* Live equation display */}
          {displayEquation && (
            <div className="text-2xl font-bold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
              {displayEquation}
            </div>
          )}
        </div>
        
        {/* Celebration banner */}
        {celebrationMessage && (
          <div className={`mb-6 p-4 rounded-xl ${
            celebrationMessage.celebration 
              ? 'bg-yellow-100 border-2 border-yellow-300' 
              : 'bg-green-100 border-2 border-green-300'
          }`}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {celebrationMessage.title}
            </h3>
            <p className="text-gray-700">{celebrationMessage.message}</p>
          </div>
        )}

        {/* Enhanced 3D Scene */}
        <div className="h-96 bg-gradient-to-b from-blue-50 to-purple-50 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading 3D shapes...</p>
              </div>
            </div>
          ) : (
            <MathScene3D
              operand1Shape={operand1Shape}
              operand2Shape={operand2Shape}
              resultShape={showResult ? resultShape : undefined}
              operation={operation}
              isAnimating={isAnimating}
              animationPhase={animationPhase}
              showResult={showResult}
            />
          )}
        </div>
      </div>

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
                {isAnimating ? '🎬 Watch the Magic!' : '✨ See the Magic!'}
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
                className="w-full btn-secondary text-left py-4 px-6 hover:bg-primary-50 hover:border-primary-300 transition-all"
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
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">✨ Animation Features:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Numbers move smoothly in 3D space</li>
              <li>• Watch them link up and combine</li>
              <li>• Morphing transformation into the answer</li>
              <li>• Special celebrations for complementary numbers!</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success celebration */}
      {showResult && mathResult && (
        <div className="card-child bg-green-50 border-2 border-green-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              🎉 {mathResult.equation} 🎉
            </h3>
            <p className="text-lg text-green-700 mb-4">
              Great job! You solved the problem!
            </p>
            {mathResult.transformation.is_complementary && (
              <p className="text-md text-orange-600 font-semibold">
                ✨ These numbers are best friends - they always add up to 10!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MathVisualizationDemo 