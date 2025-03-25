from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from eldapp.models import Trip
from eldapp.serializers import TripSerializer

from eldapp.services.ELDLogicEngine import ELDLogicEngine

class TimeLogDetail(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request, pk):
        trip = Trip.objects.get(id=pk)
        data = TripSerializer(trip).data
        return Response(data)

    def put(self, request, pk):
        trips = Trip.objects.all()
        data = TripSerializer(trips, many=True).data
        return Response(data)

    def post(self, request, pk):
        data = request.data
        route1_duration = data['route1_duration']
        route2_duration = data['route2_duration']

        # Generate a time log based on the duration of two routes
        time_log = ELDLogicEngine().generateTimeLog(route1_duration, route2_duration)

        return Response(time_log, status=status.HTTP_201_CREATED)