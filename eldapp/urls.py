from django.urls import path
from rest_framework import routers
from .apiviews import DriverViewSet, TripViewSet

from . import views

router = routers.DefaultRouter()
router.register(r'drivers', DriverViewSet)
router.register(r'trips', TripViewSet)

urlpatterns = [
    path("", views.index, name="index"),
]

urlpatterns += router.urls