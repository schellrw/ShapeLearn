"""
Main API routes for ShapeLearn math operations
"""

from flask import Blueprint, request, jsonify
from ..models.math_operations import MathShapeEngine

api_bp = Blueprint('api', __name__)

# Initialize the math shape engine
math_engine = MathShapeEngine()

@api_bp.route('/shapes', methods=['GET'])
def get_all_shapes():
    """Get shape definitions for all numbers 0-20"""
    try:
        shapes = math_engine.get_number_shapes()
        return jsonify({
            "success": True,
            "shapes": shapes,
            "total_numbers": len(shapes)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@api_bp.route('/shapes/<int:number>', methods=['GET'])
def get_number_shape(number):
    """Get shape definition for a specific number"""
    try:
        if number < 0 or number > 100:
            return jsonify({
                "success": False,
                "error": "Number must be between 0 and 100"
            }), 400
            
        shape = math_engine.get_shape_for_number(number)
        return jsonify({
            "success": True,
            "number": number,
            "shape": shape
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@api_bp.route('/operation', methods=['POST'])
def calculate_operation():
    """
    Calculate math operation and return transformation steps
    Expected JSON: {"operation": "addition", "operand1": 3, "operand2": 7}
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "error": "No JSON data provided"
            }), 400
            
        operation = data.get('operation')
        operand1 = data.get('operand1')
        operand2 = data.get('operand2')
        
        # Validate inputs
        if operation not in ['addition', 'subtraction']:
            return jsonify({
                "success": False,
                "error": "Operation must be 'addition' or 'subtraction'"
            }), 400
            
        if not isinstance(operand1, int) or not isinstance(operand2, int):
            return jsonify({
                "success": False,
                "error": "Operands must be integers"
            }), 400
            
        if operand1 < 0 or operand1 > 20 or operand2 < 0 or operand2 > 20:
            return jsonify({
                "success": False,
                "error": "Numbers must be between 0 and 20 for POC"
            }), 400
        
        # Calculate result and get transformation
        if operation == 'addition':
            result = operand1 + operand2
            if result > 20:  # Keep POC simple
                return jsonify({
                    "success": False,
                    "error": "Result exceeds 20 (POC limitation)"
                }), 400
                
            transformation = math_engine.get_addition_transformation(operand1, operand2)
        else:  # subtraction
            if operand2 > operand1:
                return jsonify({
                    "success": False,
                    "error": "Cannot subtract larger number from smaller (avoiding negative results in POC)"
                }), 400
                
            result = operand1 - operand2
            transformation = math_engine.get_subtraction_transformation(operand1, operand2)
        
        return jsonify({
            "success": True,
            "operation": operation,
            "operand1": operand1,
            "operand2": operand2,
            "result": result,
            "transformation": transformation,
            "equation": f"{operand1} {'+' if operation == 'addition' else '-'} {operand2} = {result}"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@api_bp.route('/practice', methods=['POST'])
def generate_practice_problems():
    """
    Generate practice problems based on current skill level
    Expected JSON: {"skill_level": "beginner", "operation_type": "addition", "count": 5}
    """
    try:
        data = request.get_json()
        
        skill_level = data.get('skill_level', 'beginner')
        operation_type = data.get('operation_type', 'addition')
        count = data.get('count', 5)
        
        problems = math_engine.generate_practice_problems(
            skill_level=skill_level,
            operation_type=operation_type,
            count=count
        )
        
        return jsonify({
            "success": True,
            "problems": problems,
            "skill_level": skill_level,
            "operation_type": operation_type
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500 