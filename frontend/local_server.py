import os
from http.server import HTTPServer
from api.index import handler
from dotenv import load_dotenv

def run(server_class=HTTPServer, handler_class=handler, port=8000):
    try:
        # Load environment variables
        load_dotenv()
        
        # Check if OPENAI_API_KEY is set
        if not os.getenv('OPENAI_API_KEY'):
            print("WARNING: OPENAI_API_KEY is not set in .env file")
            return

        # Start the server
        server_address = ('', port)
        httpd = server_class(server_address, handler_class)
        print(f"Starting server on http://localhost:{port}")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()
    except Exception as e:
        print(f"Error starting server: {e}")
        import traceback
        print(traceback.format_exc())

if __name__ == '__main__':
    run() 