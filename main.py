from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from chatbot import get_response

app = Flask(__name__)
CORS(app)

# Route to serve the frontend
@app.route('/')
def home():
    return render_template('index.html')

# Route to handle chatbot requests
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get("message")

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    response = get_response(user_message)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
