from flask import request, jsonify
import os
from werkzeug.utils import secure_filename
from app.controllers.chatbot import medical_chatbot_response, img_medical_chatbot_response
from app.controllers.image_captioning import generate_caption

def medical_chatbot_route(app):
    @app.route('/chatbot',methods=['POST'])
    def chatbot():
        """Handles text-based medical queries."""
        data = request.get_json()
        user_query = data.get("query", "")

        if not user_query:
            return jsonify({"error": "Query cannot be empty"}), 400

        response = medical_chatbot_response(user_query)
        return jsonify({"response": response})
    
    @app.route('/chatbot-img',methods=['POST'])
    def img_chatbot():
        """Handles image-based medical queries."""
        # Initialize variables
        image_path = None
        caption = None
        
        # First check if the content type is multipart/form-data (for image)
        if 'image' in request.files:
            # If the request contains an image file
            image = request.files['image']
            
            # Secure the filename to avoid path issues
            image_filename = secure_filename(image.filename)
            
            # Create a directory for saving the image if it doesn't exist
            image_path = os.path.join("temp_images", image_filename)
            os.makedirs("temp_images", exist_ok=True)

            # Save the image to the temporary folder
            image.save(image_path)

            # Generate caption for the uploaded image
            caption = generate_caption(image_path)
        
        # Handle case where no image or text is provided
        if not caption:
            return jsonify({"error": "No image or text provided"}), 400
        
        # Optionally, clean up the saved image if it exists
        if image_path and os.path.exists(image_path):
            os.remove(image_path) 

        # Generate design idea using Gemini AI based on the caption
        try:
            response = img_medical_chatbot_response(caption)
            return jsonify({"response": response})
        except Exception as e:
            return jsonify({"error": f"Error generating design idea: {str(e)}"}), 500

