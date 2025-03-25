from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from eldapp.models import Trip
from eldapp.serializers import TripSerializer

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

    def post(self, request):
        data = request.data
        serializer = TripSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)