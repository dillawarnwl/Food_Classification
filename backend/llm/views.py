import os
import random
import numpy as np
from scipy.stats import entropy
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import Layer
import tensorflow as tf
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.files.storage import default_storage
from llm.serializers import FoodImageSerializer
from llm.models import FoodImage

class Cast(Layer):
    def __init__(self, **kwargs):
        super(Cast, self).__init__(**kwargs)

    def call(self, inputs):
        return tf.cast(inputs, tf.float32)  

tf.keras.mixed_precision.set_global_policy('mixed_float16')

model_path = 'llm/food_classifier_model.h5'
model = load_model(model_path, custom_objects={'Cast': Cast})

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
            img_array /= 255.0  # Normalize as during training

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

class FoodImageView(APIView):
    def get(self, request, *args, **kwargs):
        country = request.query_params.get('country')
        countries = dict(FoodImage.COUNTRY_CHOICES)

        if not country:
            food_images = FoodImage.objects.all()
            grouped_data = {country_name: [] for _, country_name in FoodImage.COUNTRY_CHOICES}

            for food in food_images:
                country_name = countries.get(food.country, 'Unknown')
                if country_name != 'All':
                    grouped_data[country_name].append(FoodImageSerializer(food).data)
                grouped_data['All'].append(FoodImageSerializer(food).data)

            random.shuffle(grouped_data['All'])
            return Response(grouped_data)

        food_images = FoodImage.objects.filter(country=country.upper())
        return Response({
            f'{countries.get(country.upper())}': FoodImageSerializer(food_images, many=True).data
        })