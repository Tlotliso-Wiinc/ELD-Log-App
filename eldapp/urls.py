from django.urls import path
from rest_framework import routers
from .apiviews import DriverViewSet, TripViewSet

from . import views

router = routers.DefaultRouter()
router.register('drivers', DriverViewSet)
router.register('trips', TripViewSet)

urlpatterns = [
    path("", views.app, name="app"),
]

urlpatterns += router.urls