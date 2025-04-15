from django.urls import path
from llm.views import FoodClassificationView, FoodImageView

urlpatterns = [
    path('classify/', FoodClassificationView.as_view(), name='classify'),
    path('sample-images/', FoodImageView.as_view(), name='image'),
]