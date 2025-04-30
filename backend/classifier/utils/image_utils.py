import os
import numpy as np
from tensorflow.keras.preprocessing import image
import cv2

def preprocess_image_for_model(file_path):
    img = image.load_img(file_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0
    return img_array

def load_original_image(file_path):
    original_img = cv2.imread(file_path)
    return cv2.cvtColor(original_img, cv2.COLOR_BGR2RGB)

def delete_temp_file(file_path):
    if os.path.exists(file_path):
        os.remove(file_path)
