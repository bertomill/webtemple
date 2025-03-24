from http.server import BaseHTTPRequestHandler
import json
import sys
import traceback
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            print("Received POST request to:", self.path)
            print("Headers:", self.headers)
            
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            print("Content length:", content_length)
            
            post_data = self.rfile.read(content_length)
            print("Raw request data:", post_data)
            
            request_data = json.loads(post_data.decode('utf-8'))
            print("Parsed request data:", request_data)

            # Initialize OpenAI
            api_key = os.getenv("OPENAI_API_KEY")
            print("API key present:", bool(api_key))
            
            client = OpenAI(api_key=api_key)
            
            # Create a prompt for OpenAI
            search_prompt = f"""
            Find 3-5 leading companies in the {request_data['industry']} industry that have successful websites.
            Focus on companies that target {request_data['target_audience']} and offer {request_data['key_features']}.
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
            Based on the business idea: {request_data['business_idea']}
            Industry: {request_data['industry']}
            Target Audience: {request_data['target_audience']}
            Key Features: {request_data['key_features']}
            
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
            
            # Prepare the response
            response_data = {
                "competitors": competitors,
                "recommendation": recommendation.choices[0].message.content
            }

            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            print("Error occurred:", str(e))
            print("Traceback:", traceback.format_exc())
            
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_response = {
                "error": str(e),
                "traceback": traceback.format_exc()
            }
            self.wfile.write(json.dumps(error_response).encode())

    def do_OPTIONS(self):
        print("Received OPTIONS request")
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers() 