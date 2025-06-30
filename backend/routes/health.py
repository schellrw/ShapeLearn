"""
Health check routes for ShapeLearn backend
"""

from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "ShapeLearn Math API",
        "version": "0.1.0"
    }) 