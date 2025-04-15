from django.contrib import admin
from llm.models import FoodImage

@admin.register(FoodImage)
class FoodImageAdmin(admin.ModelAdmin):
    list_display = ['country', 'image', 'uploaded_at']
    list_filter = ['country']
    search_fields = ['country']
    ordering = ['country']
