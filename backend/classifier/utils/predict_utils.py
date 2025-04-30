import numpy as np

CLASS_NAMES = ['Chinese', 'Italian', 'Japanese', 'Korean', 'Pakistani']

def get_prediction(model, img_array):
    predictions = model.predict(img_array)[0]
    predicted_index = np.argmax(predictions)
    predicted_class = CLASS_NAMES[predicted_index]
    confidence = float(predictions[predicted_index])
    probabilities = {
        CLASS_NAMES[i]: float(predictions[i]) for i in range(len(CLASS_NAMES))
    }
    return predicted_class, confidence, probabilities
