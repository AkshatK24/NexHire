from analyzer import analyze_resume
from flask import Flask, request, jsonify
from parser import extract_text_from_pdf
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Resume Analyzer Backend Running"


@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    job_description = data.get("job_description")

    result = analyze_resume(
    "",
    job_description,
    ""
)

    return jsonify({
        "analysis": result
    })
    
    
    
    
    
    
@app.route("/upload", methods=["POST"])
def upload_resume():

    file = request.files["resume"]

    extracted_text = extract_text_from_pdf(file)

    return jsonify({
        "resume_text": extracted_text
    })
    
    
    
    
    
    
    
@app.route("/analyze-resume", methods=["POST"])
def analyze_uploaded_resume():

    resume_file = request.files["resume"]

    job_description = request.form["job_description"]

    company_name = request.form.get(
        "company_name",
        ""
    )

    resume_text = extract_text_from_pdf(
        resume_file
    )

    analysis = analyze_resume(
        resume_text,
        job_description,
        company_name
    )
    print("==============")
    print(analysis)
    print(type(analysis))
    print("==============")

    return jsonify({
        "analysis": analysis
    })


if __name__ == "__main__":
    app.run(debug=True)