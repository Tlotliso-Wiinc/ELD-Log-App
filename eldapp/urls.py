from django.urls import path
from rest_framework import routers
from .apiviews import DriverViewSet, TripViewSet

from . import views

router = routers.DefaultRouter()
router.register('api/drivers', DriverViewSet)
router.register('api/trips', TripViewSet)

urlpatterns = [
    path("", views.index, name="index"),
]

urlpatterns += router.urls