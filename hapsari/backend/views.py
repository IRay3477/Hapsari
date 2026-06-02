from rest_framework import generics
from .models import Hapsari
from .serializers import HapsariSerializer

class ProductListAPI(generics.ListAPIView):
    queryset = Hapsari.objects.all()
    serializer_class = HapsariSerializer
# Create your views here.
