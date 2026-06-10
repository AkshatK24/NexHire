import os
import json
from dotenv import load_dotenv
from groq import Groq
import re

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_resume(
    resume_text,
    job_description,
    company_name
):

    prompt = f"""
You are an expert Placement Preparation Copilot.

Resume:
{resume_text}

Company:
{company_name}

Job Description:
{job_description}

Return ONLY valid JSON.

{{
  "match_score": 0,
  "apply_recommendation": "",
  "reason": "",
  "difficulty_level": "",

  "job_summary": "",

  "matching_skills": [],
  "missing_skills": [],

  "recruitment_process": [],

  "expected_topics": [],

  "preparation_roadmap": [],

  "suggestions": []
}}

Rules:

1. Organize messy job descriptions into a professional summary.

2. Match the resume against the job role.

3. Give realistic match score.

4. Apply recommendation:
   YES
   MAYBE
   NO

5. Generate recruitment_process ONLY if known for that company or role.

6. If unknown:
   recruitment_process = []

7. Generate expected_topics only if relevant.

8. expected_topics should contain:
   DSA topics
   Core CS topics
   Aptitude topics
   SQL topics
   Interview topics

9. preparation_roadmap should be actionable.

Example:

[
 "Day 1-2: Arrays and Strings",
 "Day 3: SQL Queries",
 "Day 4: OOPs Revision"
]

10. suggestions should be personalized.

11. Return valid JSON only.
12. match_score must be an integer between 0 and 100.
13. Never return single digit values like 8 when 80 is intended.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        result = response.choices[0].message.content

        print("===== RAW RESPONSE =====")
        print(result)
        print("========================")

        match = re.search(r"\{.*\}", result, re.DOTALL)
        if match:
          return json.loads(match.group())
        raise Exception("No valid JSON found in the response.")  

    except Exception as e:
        return {
            "error": str(e)
        }