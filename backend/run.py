"""
ShapeLearn Backend - Application Entry Point
Runs the Flask development server
"""

import os
from . import create_app

# Create the Flask app using the factory pattern
app = create_app()

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    port = int(os.getenv('PORT', 5000))
    
    print(f"🚀 Starting ShapeLearn Math API on port {port}")
    print(f"📚 Debug mode: {debug_mode}")
    print(f"🔗 Health check: http://localhost:{port}/health")
    print(f"🧮 API endpoints: http://localhost:{port}/api/")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug_mode
    )