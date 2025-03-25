from django.urls import path
from rest_framework import routers
from .apiviews import DriverViewSet, TripViewSet, TimeLogDetail

from . import views

router = routers.DefaultRouter()
router.register('drivers', DriverViewSet)
router.register('trips', TripViewSet)

urlpatterns = [
    path("", views.app, name="app"),
    path("v2/trips/<int:pk>/time-log", TimeLogDetail.as_view(), name="time-log-detail"),
]

urlpatterns += router.urls