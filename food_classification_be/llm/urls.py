from django.urls import path
from llm.views import FoodClassificationView

urlpatterns = [
    path('classify/', FoodClassificationView.as_view(), name='classify'),
]