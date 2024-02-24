from flask import Flask, request, jsonify
import os
import sys
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

app = Flask(__name__)

try:
    # Attempt to load the pre-trained model
    model = joblib.load('/app/model.joblib')
except Exception as e:
    # Log an error message if the model fails to load and exit the script
    app.logger.error("Failed to load the pre-trained model: %s", e)
    sys.exit("Error loading the model")  # Exit the script due to the error

@app.route('/ping', methods=['GET'])
def ping():
    """Health check endpoint required by SageMaker."""
    # Check if the model was loaded correctly
    status = 200 if model else 404
    return '', status

@app.route('/invocations', methods=['POST'])
def predict():
    """Endpoint for model inference."""
    if model:
        try:
            data = request.get_json(force=True)
            inputs = np.array(data['inputs'])
            predictions = model.predict(inputs)
            return jsonify(predictions.tolist())
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Model not loaded"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 8080)))