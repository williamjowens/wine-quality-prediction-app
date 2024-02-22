from flask import Flask, request, render_template, jsonify
import pickle
import os
import numpy as np

app = Flask(__name__)

# Load the pipeline
model_path = 'pipeline.pkl'
with open(model_path, 'rb') as model_file:
    model = pickle.load(model_file)

# Define feature ranges based on original feature min and max values
FEATURE_RANGES = {
    'fixed_acidity': (3.8, 15.9),
    'volatile_acidity': (0.08, 1.58),
    'citric_acid': (0, 1.66),
    'residual_sugar': (0.6, 65.8),
    'chlorides': (0.01, 0.61),
    'free_sulfur_dioxide': (1, 289),
    'total_sulfur_dioxide': (6, 440),
    'density': (0.99, 1.04),
    'pH': (2.72, 4.01),
    'sulphates': (0.22, 2.00),
    'alcohol': (8.0, 14.9)
}

@app.route('/')
def index():
    # Pass the FEATURE_RANGES to the template
    return render_template('index.html', FEATURE_RANGES=FEATURE_RANGES)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        feature_values = [data[feature] for feature in FEATURE_RANGES]
        
        # Ensure all features are present
        if len(feature_values) != len(FEATURE_RANGES):
            raise ValueError("Missing features")

        # Make prediction
        prediction = model.predict([feature_values])[0]
        prediction = (prediction).item()
        return jsonify({'prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)