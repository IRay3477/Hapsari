from rest_framework import serializers
from .models import Hapsari

class HapsariSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hapsari
        fields = '__all__'  # Mengambil seluruh kolom dari tabel