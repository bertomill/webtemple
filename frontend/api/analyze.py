from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
import json

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BusinessRequest(BaseModel):
    business_idea: str
    industry: str
    target_audience: str
    key_features: str

@app.post("/api/analyze")
async def analyze_business(request: BusinessRequest):
    try:
        # Initialize OpenAI client
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Create a prompt for OpenAI
        search_prompt = f"""
        Find 3-5 leading companies in the {request.industry} industry that have successful websites.
        Focus on companies that target {request.target_audience} and offer {request.key_features}.
        Return the results as a JSON array of objects with 'name' and 'website' fields.
        """
        
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a web research assistant. Return results in JSON format."},
                {"role": "user", "content": search_prompt}
            ]
        )
        
        competitors = json.loads(response.choices[0].message.content)
        
        recommendation_prompt = f"""
        Based on the business idea: {request.business_idea}
        Industry: {request.industry}
        Target Audience: {request.target_audience}
        Key Features: {request.key_features}
        
        Generate a detailed website design recommendation following modern best practices.
        Include:
        1. Overall structure and layout
        2. Key sections and their purposes
        3. Design elements and color scheme
        4. User experience considerations
        5. Mobile responsiveness guidelines
        """
        
        recommendation = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a web design expert."},
                {"role": "user", "content": recommendation_prompt}
            ]
        )
        
        return {
            "competitors": competitors,
            "recommendation": recommendation.choices[0].message.content
        }
    except Exception as e:
        return {"error": str(e)}, 500 