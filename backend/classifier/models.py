from django.db import models

class FoodImage(models.Model):
    COUNTRY_CHOICES = [
        ('ALL', 'All'),
        ('PK', 'Pakistani'),
        ('CH', 'Chinese'),
        ('KO', 'Korean'),
        ('IT', 'Italian'),
        ('JA', 'Japanese'),
    ]
    country = models.CharField(max_length=50, choices=COUNTRY_CHOICES)
    image = models.ImageField(upload_to='food_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)