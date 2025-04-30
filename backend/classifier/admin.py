from django.contrib import admin
from classifier.models import FoodImage
from django.apps import apps
from django.contrib.admin.sites import AlreadyRegistered
from django.contrib.admin.exceptions import NotRegistered

for app_config in apps.get_app_configs():
    if app_config.name != 'classifier': 
        for model in app_config.get_models():
            try:
                admin.site.unregister(model)
            except (AlreadyRegistered, NotRegistered):
                pass



@admin.register(FoodImage)
class FoodImageAdmin(admin.ModelAdmin):
    list_display = ['country', 'image', 'uploaded_at']
    list_filter = ['country']
    search_fields = ['country']
    ordering = ['country']
