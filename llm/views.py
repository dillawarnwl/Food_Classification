from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
from scipy.stats import entropy
import numpy as np
import os
from .serializers import FoodImageSerializer


model = load_model('llm/food_classifier_model.h5')

class FoodClassificationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = FoodImageSerializer(data=request.data)
        if serializer.is_valid():

            image_file = serializer.validated_data['image']
            file_path = default_storage.save(image_file.name, image_file)
            file_url = default_storage.path(file_path)

            img = image.load_img(file_url, target_size=(150, 150))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array /= 255.0

            predictions = model.predict(img_array)[0]  

            class_names = ['Chinese', 'Italian', 'Japanese', 'Korean', 'Pakistani']
            predicted_class = class_names[np.argmax(predictions)]

            top_n = 3 
            top_indices = np.argsort(predictions)[-top_n:][::-1] 
            top_predictions = [
                {"country": class_names[i], "probability": float(predictions[i])}
                for i in top_indices
            ]

            uncertainty = float(entropy(predictions))

            os.remove(file_url)

            return Response({
                'predicted_class': predicted_class,
                'top_predictions': top_predictions, 
                'uncertainty': uncertainty,         
                'all_predictions': {                 
                    class_names[i]: float(predictions[i])
                    for i in range(len(class_names))
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)