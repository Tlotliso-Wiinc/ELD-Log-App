from django.db import models
from django.contrib.auth.models import User

class Driver(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    driver_id = models.CharField(max_length=20, unique=True)
    license_number = models.CharField(max_length=20)
    trailer_number = models.CharField(max_length=20)
    carrier = models.CharField(max_length=20)
    main_office_address = models.CharField(max_length=255)
    home_terminal_address = models.CharField(max_length=255)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.driver_id}"