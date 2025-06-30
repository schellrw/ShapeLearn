"""
Math Shape Engine - Core logic for number shape transformations
Handles the mathematical concepts behind ShapeLearn's visualization system
"""

import random
from typing import Dict, List, Tuple, Any
import numpy as np

class MathShapeEngine:
    """
    Core engine for managing number shapes and their transformations
    Based on visual-spatial relationships between numbers
    """
    
    def __init__(self):
        """Initialize the math shape engine with base shape definitions"""
        self.shape_definitions = self._initialize_shapes()
        self.complementary_pairs = {
            1: 9, 2: 8, 3: 7, 4: 6, 5: 5,
            6: 4, 7: 3, 8: 2, 9: 1
        }
    
    def _initialize_shapes(self) -> Dict[int, Dict[str, Any]]:
        """
        Initialize 3D shape definitions for numbers 0-20
        Each shape has geometric properties for Three.js rendering
        """
        shapes = {}
        
        # Define basic shapes for single digits (0-9)
        base_shapes = {
            0: {
                "type": "torus",
                "geometry": {"radius": 1.2, "tube": 0.4, "radialSegments": 16, "tubularSegments": 32},
                "color": "#FF6B6B",
                "position": [0, 0, 0],
                "scale": [1, 1, 1],
                "description": "A complete circle representing wholeness and zero"
            },
            1: {
                "type": "cylinder",
                "geometry": {"radiusTop": 0.2, "radiusBottom": 0.3, "height": 2.5},
                "color": "#4ECDC4",
                "position": [0, 0, 0],
                "scale": [1, 1, 1],
                "description": "A tall, slender pillar representing unity and singularity"
            },
            2: {
                "type": "curved_path",
                "geometry": {"points": [[0, 1, 0], [1, 1, 0], [1, 0, 0], [0, 0, 0], [1, 0, 0]], "thickness": 0.3},
                "color": "#45B7D1",
                "position": [0, 0, 0],
                "scale": [1, 1, 1],
                "description": "A curved path with flowing lines, like the number 2"
            },
            3: {
                "type": "double_curve",
                "geometry": {"curves": 2, "radius": 0.8, "thickness": 0.3},
                "color": "#96CEB4",
                "position": [0, 0, 0],
                "scale": [1, 1, 1],
                "description": "Two curved sections that can interlock with others",
                "connection_points": ["top_curve", "middle_gap", "bottom_curve"]
            },
            4: {
                "type": "angular_frame",
                "geometry": {"width": 1.5, "height": 2, "thickness": 0.2},
                "color": "#FECA57",
                "position": [0, 0, 0],
                "scale": [1, 1, 1],
                "description": "An angular, structural frame with strong corners"
            },
            5: {
                "type": "flag_shape",
                "geometry": {"pole_height": 2, "flag_width": 1.2, "thickness": 0.25},
                "color": "#FF9FF3",
                "position": [0, 0, 0],
                "scale": [1, 1, 1],
                "description": "A flag-like shape with horizontal and vertical elements"
            },
            6: {
                "type": "spiral",
                "geometry": {"radius": 1, "turns": 1.5, "thickness": 0.3},
                "color": "#54A0FF",
                "position": [0, 0, 0],
                "scale": [1, 1, 1],
                "description": "A spiral that can nestle with other curved numbers"
            },
            7: {
                "type": "flag_post",
                "geometry": {"pole_height": 2.2, "flag_width": 1.4, "angle": 45},
                "color": "#5F27CD",
                "position": [0, 0, 0],
                "scale": [1, 1, 1],
                "description": "An angular flag that can invert and connect",
                "connection_points": ["flag_tip", "pole_base", "corner_joint"]
            },
            8: {
                "type": "double_loop",
                "geometry": {"loops": 2, "radius": 0.7, "thickness": 0.3},
                "color": "#00D2D3",
                "position": [0, 0, 0],
                "scale": [1, 1, 1],
                "description": "Two connected loops that can interlock with linear shapes"
            },
            9: {
                "type": "curved_tail",
                "geometry": {"head_radius": 0.8, "tail_length": 1.5, "thickness": 0.3},
                "color": "#FF6B6B",
                "position": [0, 0, 0],
                "scale": [1, 1, 1],
                "description": "A curved head with flowing tail, complementary to 1"
            }
        }
        
        # Add base shapes to our collection
        shapes.update(base_shapes)
        
        # Generate compound shapes for numbers 10-20
        for num in range(10, 21):
            tens_digit = num // 10
            ones_digit = num % 10
            
            shapes[num] = {
                "type": "compound",
                "components": [
                    {
                        "shape": shapes[tens_digit].copy(),
                        "position": [-1.5, 0, 0],
                        "label": "tens"
                    },
                    {
                        "shape": shapes[ones_digit].copy(),
                        "position": [1.5, 0, 0],
                        "label": "ones"
                    } if ones_digit != 0 else None
                ],
                "color": "#A8E6CF",
                "description": f"Compound number combining {tens_digit} and {ones_digit}"
            }
        
        return shapes
    
    def get_number_shapes(self) -> Dict[int, Dict[str, Any]]:
        """Return all shape definitions"""
        return self.shape_definitions
    
    def get_shape_for_number(self, number: int) -> Dict[str, Any]:
        """Get shape definition for a specific number"""
        if number not in self.shape_definitions:
            raise ValueError(f"Shape not defined for number {number}")
        return self.shape_definitions[number]
    
    def get_addition_transformation(self, operand1: int, operand2: int) -> Dict[str, Any]:
        """
        Generate transformation steps for addition visualization
        Based on the concept that complementary numbers have natural linking points
        """
        result = operand1 + operand2
        
        # Check if this is a complementary pair (adds to 10)
        is_complementary = (operand1 + operand2 == 10)
        
        transformation = {
            "type": "addition",
            "operand1": operand1,
            "operand2": operand2,
            "result": result,
            "is_complementary": is_complementary,
            "steps": []
        }
        
        if is_complementary:
            # Special transformation for base-10 pairs
            transformation["steps"] = [
                {
                    "step": 1,
                    "description": f"Number {operand1} and {operand2} are complementary - they naturally fit together",
                    "animation": "highlight_complementary",
                    "duration": 1000,
                    "shapes": {
                        "operand1": {"position": [-2, 0, 0], "scale": [1, 1, 1]},
                        "operand2": {"position": [2, 0, 0], "scale": [1, 1, 1]}
                    }
                },
                {
                    "step": 2,
                    "description": f"Watch how {operand1} and {operand2} connect at their natural linking points",
                    "animation": "move_to_link",
                    "duration": 2000,
                    "shapes": {
                        "operand1": {"position": [-0.8, 0, 0], "rotation": [0, 0, 0]},
                        "operand2": {"position": [0.8, 0, 0], "rotation": [0, 0, 0]}
                    }
                },
                {
                    "step": 3,
                    "description": "The shapes flow together to create 10!",
                    "animation": "merge_to_result",
                    "duration": 1500,
                    "shapes": {
                        "result": {"position": [0, 0, 0], "scale": [1.2, 1.2, 1.2]}
                    }
                }
            ]
        else:
            # General addition transformation
            transformation["steps"] = [
                {
                    "step": 1,
                    "description": f"Starting with {operand1} and {operand2}",
                    "animation": "present_operands",
                    "duration": 1000,
                    "shapes": {
                        "operand1": {"position": [-2, 0, 0], "scale": [1, 1, 1]},
                        "operand2": {"position": [2, 0, 0], "scale": [1, 1, 1]}
                    }
                },
                {
                    "step": 2,
                    "description": f"Bringing {operand1} and {operand2} together",
                    "animation": "move_together",
                    "duration": 2000,
                    "shapes": {
                        "operand1": {"position": [-0.5, 0, 0]},
                        "operand2": {"position": [0.5, 0, 0]}
                    }
                },
                {
                    "step": 3,
                    "description": f"They combine to form {result}!",
                    "animation": "transform_to_result",
                    "duration": 1500,
                    "shapes": {
                        "result": {"position": [0, 0, 0], "scale": [1.2, 1.2, 1.2]}
                    }
                }
            ]
        
        return transformation
    
    def get_subtraction_transformation(self, operand1: int, operand2: int) -> Dict[str, Any]:
        """
        Generate transformation steps for subtraction visualization
        Subtraction as the larger number transforming when smaller number "phases through"
        """
        result = operand1 - operand2
        
        transformation = {
            "type": "subtraction",
            "operand1": operand1,
            "operand2": operand2,
            "result": result,
            "steps": [
                {
                    "step": 1,
                    "description": f"Starting with {operand1}",
                    "animation": "present_minuend",
                    "duration": 1000,
                    "shapes": {
                        "operand1": {"position": [0, 0, 0], "scale": [1.2, 1.2, 1.2], "opacity": 1}
                    }
                },
                {
                    "step": 2,
                    "description": f"Watch as {operand2} phases through like a storm",
                    "animation": "subtraction_storm",
                    "duration": 2500,
                    "shapes": {
                        "operand1": {"opacity": 0.7, "color_shift": True},
                        "operand2": {
                            "position": [-3, 0, 0], 
                            "target_position": [3, 0, 0], 
                            "opacity": 0.6,
                            "effect": "phasing"
                        }
                    }
                },
                {
                    "step": 3,
                    "description": f"The transformation leaves us with {result}!",
                    "animation": "reveal_result",
                    "duration": 1500,
                    "shapes": {
                        "result": {"position": [0, 0, 0], "scale": [1.2, 1.2, 1.2], "opacity": 1}
                    }
                }
            ]
        }
        
        return transformation
    
    def generate_practice_problems(self, skill_level: str = "beginner", 
                                 operation_type: str = "addition", 
                                 count: int = 5) -> List[Dict[str, Any]]:
        """Generate practice problems based on skill level"""
        problems = []
        
        # Define number ranges based on skill level
        ranges = {
            "beginner": (1, 5),
            "intermediate": (1, 10),
            "advanced": (1, 20)
        }
        
        min_num, max_num = ranges.get(skill_level, (1, 5))
        
        for _ in range(count):
            if operation_type == "addition":
                operand1 = random.randint(min_num, max_num)
                operand2 = random.randint(min_num, max_num)
                
                # Keep results reasonable for skill level
                if operand1 + operand2 > max_num * 2:
                    operand1, operand2 = min(operand1, operand2), min_num
                
                result = operand1 + operand2
                equation = f"{operand1} + {operand2} = ?"
                
            else:  # subtraction
                operand1 = random.randint(min_num + 1, max_num)
                operand2 = random.randint(min_num, operand1)  # Ensure positive result
                result = operand1 - operand2
                equation = f"{operand1} - {operand2} = ?"
            
            problems.append({
                "id": len(problems) + 1,
                "equation": equation,
                "operand1": operand1,
                "operand2": operand2,
                "result": result,
                "operation": operation_type,
                "skill_level": skill_level,
                "is_complementary": (operation_type == "addition" and operand1 + operand2 == 10)
            })
        
        return problems
    
    def analyze_learning_progress(self, solved_problems: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze a child's learning progress and suggest next steps
        This would be used for adaptive learning in the full app
        """
        if not solved_problems:
            return {"status": "no_data", "recommendation": "start_with_basics"}
        
        # Calculate accuracy
        correct_answers = sum(1 for p in solved_problems if p.get("correct", False))
        accuracy = correct_answers / len(solved_problems)
        
        # Analyze problem types
        addition_problems = [p for p in solved_problems if p.get("operation") == "addition"]
        subtraction_problems = [p for p in solved_problems if p.get("operation") == "subtraction"]
        
        # Calculate average response time
        response_times = [p.get("response_time", 0) for p in solved_problems if p.get("response_time")]
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0
        
        analysis = {
            "total_problems": len(solved_problems),
            "accuracy": accuracy,
            "addition_accuracy": sum(1 for p in addition_problems if p.get("correct", False)) / len(addition_problems) if addition_problems else 0,
            "subtraction_accuracy": sum(1 for p in subtraction_problems if p.get("correct", False)) / len(subtraction_problems) if subtraction_problems else 0,
            "average_response_time": avg_response_time,
            "strengths": [],
            "areas_for_improvement": [],
            "next_skill_level": "beginner",
            "recommended_practice": []
        }
        
        # Determine strengths and areas for improvement
        if analysis["addition_accuracy"] > 0.8:
            analysis["strengths"].append("addition")
        elif analysis["addition_accuracy"] < 0.6:
            analysis["areas_for_improvement"].append("addition")
            
        if analysis["subtraction_accuracy"] > 0.8:
            analysis["strengths"].append("subtraction")
        elif analysis["subtraction_accuracy"] < 0.6:
            analysis["areas_for_improvement"].append("subtraction")
        
        # Recommend next skill level
        if accuracy > 0.8 and avg_response_time < 10:  # 10 seconds
            analysis["next_skill_level"] = "intermediate" if len(solved_problems) > 10 else "beginner"
        
        return analysis