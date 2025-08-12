from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import tensorflow as tf
import numpy as np
from PIL import Image
import base64
import cv2
import logging

logger = logging.getLogger(__name__)

class FoodClassificationView(APIView):
    """
    API Endpoint for Food Classification with Grad-CAM visualization.
    Loads the model once at startup for efficiency.
    """
    parser_classes = (MultiPartParser, FormParser)

    model = tf.keras.models.load_model("model/food_model.keras")
    model.trainable = False
    
    cuisines = ["American", "Asian", "Chinese", "French", "Italian", "Japanese"]
    dishes = {
        "American": ["Burger", "Hotdog", "Pancakes", "Steak", "Apple Pie"],
        "Asian": ["Biryani", "Sushi", "Ramen", "Spring Roll", "Fried Rice"],
        "Chinese": ["Kung Pao Chicken", "Dim Sum", "Sweet and Sour Pork", "Chow Mein", "Mapo Tofu"],
        "French": ["Croissant", "Baguette", "Ratatouille", "Crème Brûlée", "Quiche"],
        "Italian": ["Pizza", "Pasta", "Risotto", "Lasagna", "Tiramisu"],
        "Japanese": ["Sushi", "Tempura", "Ramen", "Miso Soup", "Onigiri"]
    }
    @staticmethod
    def preprocess_image(image_file):
        image = Image.open(image_file).convert("RGB")
        image_resized = image.resize((224, 224))
        img_array = np.array(image_resized, dtype=np.float32) / 255.0
        return np.expand_dims(img_array, axis=0)

    def post(self, request):
        image_file = request.FILES.get("image")
        if not image_file:
            return Response({"error": "No image uploaded"}, status=400)

        try:
            img_array = self.preprocess_image(image_file)
            if img_array.shape != (1, 224, 224, 3):
                img_array = np.reshape(img_array, (1, 224, 224, 3)).astype(np.float32)

            predictions = self.model.predict(img_array)
            pred_index = int(np.argmax(predictions))
            cuisine = self.cuisines[pred_index // 5]
            dish = self.dishes[cuisine][pred_index % 5]
            confidence = float(np.max(predictions))

            return Response({
                "predicted_cuisine": cuisine,
                "predicted_dish": dish,
                "confidence": confidence
            })
        except Exception as e:
            logger.exception("Error in food classification")
            return Response({"error": str(e)}, status=500)