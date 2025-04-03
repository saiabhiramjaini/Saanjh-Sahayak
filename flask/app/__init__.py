from flask import Flask
from flask_cors import CORS
from app.routes.report_route import medical_analysis_route
from app.routes.chatbot_routes import medical_chatbot_route

def create_app():
    """Creates and configures the Flask application."""
    app = Flask(__name__)
    CORS(app)  # Enable CORS for frontend

    # Register routes
    medical_analysis_route(app)
    medical_chatbot_route(app)

    return app
