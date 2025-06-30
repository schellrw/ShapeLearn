"""
ShapeLearn Backend - Flask Application Factory
Educational platform for children ages 5-10 using 3D shape-based math visualizations
"""

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

def create_app(config_name='development'):
    """
    Application factory pattern for creating Flask app instances
    """
    # Load environment variables
    load_dotenv()
    
    # Create Flask app
    app = Flask(__name__)
    
    # Configure CORS for frontend communication
    CORS(app, origins=[
        'http://localhost:5173',  # Vite dev server
        'http://localhost:3000',  # Alternative dev port
        os.getenv('FRONTEND_URL', 'http://localhost:5173')
    ])
    
    # Configuration
    app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Register blueprints (routes)
    from .routes.api import api_bp
    from .routes.health import health_bp
    
    app.register_blueprint(health_bp)
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Global error handlers
    @app.errorhandler(404)
    def not_found(error):
        from flask import jsonify
        return jsonify({
            "success": False,
            "error": "Endpoint not found"
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        from flask import jsonify
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500
    
    return app 