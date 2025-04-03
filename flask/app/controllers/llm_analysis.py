import google.generativeai as genai
from config import Config

# Configure Gemini API key
genai.configure(api_key=Config.GEMINI_API_KEY)
    
def analyze_medical_report(report):
    """Generates an upcycling idea using Gemini AI."""
    prompt = f'''
    You are an advanced AI medical report analyzer specializing in elderly care. Based on the given **medical report content**, generate a structured analysis with the following **clear and precise outputs**:

    ---

    ## **1️⃣ DETAILED ANALYSIS**
    - Provide a **comprehensive** breakdown of the patient's condition.
    - Explain **key findings, test results, and their medical significance**.
    - Highlight any **critical observations** requiring immediate attention.

    ## **2️⃣ PRECAUTIONS**
    - List **essential precautions** the patient must follow.
    - Provide **clear, actionable recommendations** in **short, specific steps**.
    - Ensure all precautions are given as simple **string-based instructions**.

    ## **3️⃣ SPECIALIST RECOMMENDATIONS**
    - List the **type of doctor(s)** the patient should consult as a single string (comma-separated if multiple).
    - No additional details—just the type of doctors in text format.

    ## **4️⃣ PREDICTIONS**
    - Provide possible **health predictions** or risks in simple **text-based statements**.
    - Avoid detailed objects—just clear, meaningful text.

    ---

    Medical report content to analyze:
    {report}

    ### **📌 JSON OUTPUT FORMAT:**
    ✅ **Return the response in the following JSON format ONLY (no extra text, comments, or explanations).**  
    ✅ **Ensure values are strings, as required by our schema.**

    ```json
    {{
    "detailedAnalysis": "Patient exhibits signs of moderate hypertension with elevated blood pressure levels. No immediate life-threatening risks detected.",

    "precautions": [
        "Monitor blood pressure daily and record readings.",
        "Reduce sodium intake and maintain a balanced diet."
    ],

    "typeOfDoctors": "Cardiologist",

    "predictions": [
        "Patient is at risk of developing chronic hypertension if lifestyle changes are not implemented.",
        "With proper medication and lifestyle changes, condition may improve within 3 months."
    ]
    }}

    ```
        

    '''

    # Generate content using Gemini
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }

    try:
        analysis_model = genai.GenerativeModel(model_name="gemini-2.0-flash-exp", generation_config=generation_config)
        response = analysis_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error generating analysis: {str(e)}"