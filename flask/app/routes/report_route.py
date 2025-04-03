from flask import request, jsonify
from app.controllers.text_extractor import extract_text_from_file
from app.controllers.llm_analysis import analyze_medical_report 

def medical_analysis_route(app):
    @app.route('/report', methods=['POST'])
    def report():
        # Check if the request has a file
        uploaded_file = request.files.get("file")
        
        if not uploaded_file:
            return jsonify({"error": "Please provide a pdf file."}), 400
        
        extracted_text  = extract_text_from_file(uploaded_file)
        if "Unsupported file type." in extracted_text or "Error reading file:" in extracted_text:
            return jsonify({"error": extracted_text}), 400        
        
        # Call the model and get the analysis
        ai_analysis = analyze_medical_report(extracted_text)

        if ai_analysis.startswith("```json"):
            ai_analysis = ai_analysis[7:]  # Remove the first 7 characters (```json and newline)

        if ai_analysis.endswith("```"):
            ai_analysis = ai_analysis[:-3]  # Remove the last 3 characters (```)
        
        # Returning the cleaned JSON output 
        return ai_analysis.strip()