from rest_framework import serializers
from llm.models import FoodImage

class FoodImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodImage
        fields = ['image', 'uploaded_at']