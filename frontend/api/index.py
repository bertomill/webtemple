from http.server import BaseHTTPRequestHandler
import json
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def parse_competitors(text):
    """Convert the OpenAI response text into a list of competitors"""
    # Split the text into lines and clean up
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    # Remove any numbering and clean up each competitor
    competitors = [line.split('.', 1)[-1].strip() for line in lines]
    return competitors

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            # Read the request body
            content_length = int(self.headers.get('Content-Length', 0))
            request_body = self.rfile.read(content_length)
            data = json.loads(request_body)

            # Initialize OpenAI client
            client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

            # Create search prompt
            search_prompt = f"""Find exactly 3 leading companies in {data['industry']} industry targeting {data['targetAudience']}.
            Format each company on a new line with a number, like:
            1. Company Name
            2. Company Name
            3. Company Name"""

            # Get competitors using OpenAI
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": search_prompt}]
            )
            competitors_text = completion.choices[0].message.content
            competitors = parse_competitors(competitors_text)

            # Create design prompt
            design_prompt = f"""Based on this business idea: {data['businessIdea']}, 
            industry: {data['industry']}, target audience: {data['targetAudience']}, 
            and key features: {data['keyFeatures']}, provide website design recommendations."""

            # Get design recommendations using OpenAI
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": design_prompt}]
            )
            design = completion.choices[0].message.content

            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {
                "competitors": competitors,  # This will now be a list
                "design": design
            }
            self.wfile.write(json.dumps(response_data).encode())

        except Exception as e:
            print(f"Error: {str(e)}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode()) 