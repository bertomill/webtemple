# Website Design Research Assistant

This application helps users research and design their business websites by analyzing industry leaders' websites and generating design recommendations.

## Features
- Collects user's business idea and requirements
- Searches for industry leaders using OpenAI's web search
- Analyzes competitor websites for design patterns
- Generates website design recommendations
- Provides screenshots and structural analysis

## Setup

1. Clone this repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Create a `.env` file with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```
4. Run the application:
```bash
uvicorn main:app --reload
```

## Usage
1. Open your browser to `http://localhost:8000`
2. Fill in your business details and requirements
3. Submit to receive website design recommendations 