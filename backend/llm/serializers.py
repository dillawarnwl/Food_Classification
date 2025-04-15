from rest_framework import serializers
from llm.models import FoodImage

class FoodImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodImage
        fields = ['country', 'image', 'uploaded_at']
        read_only_fields = ['country']
