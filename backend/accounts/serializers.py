from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class CustomUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'avatar')

    def validate(self, data):
        if not data.get('first_name') or not data.get('last_name'):
            raise serializers.ValidationError(
                {'error': 'First name and last name are required.'}
            )
        return data


class CustomUserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'avatar', 'date_joined')
