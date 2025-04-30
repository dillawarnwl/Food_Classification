import os
import random
import numpy as np
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.files.storage import default_storage
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Layer
import tensorflow as tf

from classifier.serializers import FoodImageSerializer
from classifier.models import FoodImage
from classifier.src.explainability.gradcam import GradCAM
from classifier.utils.image_utils import (
    preprocess_image_for_model,
    load_original_image,
    delete_temp_file,
)
from classifier.utils.predict_utils import get_prediction

class Cast(Layer):
    def __init__(self, **kwargs):
        super(Cast, self).__init__(**kwargs)

    def call(self, inputs):
        return tf.cast(inputs, tf.float32)

tf.keras.mixed_precision.set_global_policy('mixed_float16')
MODEL_PATH = 'classifier/src/models/food_classifier_model.keras'
model = load_model(MODEL_PATH, custom_objects={'Cast': Cast})

class FoodClassificationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = FoodImageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        image_file = serializer.validated_data['image']
        file_path = default_storage.save(image_file.name, image_file)
        file_url = default_storage.path(file_path)

        try:
            model_input = preprocess_image_for_model(file_url)
            original_img = load_original_image(file_url)

            predicted_class, confidence, probabilities = get_prediction(model, model_input)

            gradcam = GradCAM(model)
            heatmap_image = gradcam.generate_and_encode(original_img, model_input)

            response_data = {
                'predicted_class': predicted_class,
                'confidence': confidence,
                'heatmap_image': heatmap_image,
                'class_probabilities': probabilities
            }
            return Response(response_data, status=status.HTTP_200_OK)
        finally:
            delete_temp_file(file_url)

class FoodImageView(APIView):
    def get(self, request, *args, **kwargs):
        country = request.query_params.get('country')
        countries = dict(FoodImage.COUNTRY_CHOICES)

        if not country:
            return Response(self._get_grouped_data(countries))

        food_images = FoodImage.objects.filter(country=country.upper())
        return Response({
            f'{countries.get(country.upper(), "Unknown")}':
            FoodImageSerializer(food_images, many=True).data
        })

    def _get_grouped_data(self, countries):
        food_images = FoodImage.objects.all()
        grouped_data = {name: [] for _, name in FoodImage.COUNTRY_CHOICES}

        for food in food_images:
            country_name = countries.get(food.country, 'Unknown')
            if country_name != 'All':
                grouped_data[country_name].append(FoodImageSerializer(food).data)
            grouped_data['All'].append(FoodImageSerializer(food).data)

        random.shuffle(grouped_data['All'])
        return grouped_data
