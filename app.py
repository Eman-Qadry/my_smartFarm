# app.py

import os
import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Load your TensorFlow model
model = load_model('model.h5')
labels = {0: 'Healthy', 1: 'Powdery', 2: 'Rust'}

def getResult(image_path):
    img = load_img(image_path, target_size=(225, 225))
    x = img_to_array(img)
    x = x.astype('float32') / 255.
    x = np.expand_dims(x, axis=0)
    predictions = model.predict(x)[0]
    return predictions

@app.route('/')
def index():
    return 'Flask Server is running.'

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    f = request.files['file']
    if f.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(f.filename)
    file_path = os.path.join('uploads', filename)
    f.save(file_path)

    predictions = getResult(file_path)
    predicted_label = labels[np.argmax(predictions)]
    return jsonify({'prediction': predicted_label}), 200

if __name__ == '__main__':
    app.run(debug=True)
