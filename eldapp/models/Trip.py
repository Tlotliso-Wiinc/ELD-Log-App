from django.db import models
from .Driver import Driver

class Trip(models.Model):
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.IntegerField() 
    created_at = models.DateTimeField(auto_now_add=True)
    current_coordinates = models.JSONField(default=dict)
    
    def __str__(self):
        return f"Trip from {self.current_location} to {self.dropoff_location}"