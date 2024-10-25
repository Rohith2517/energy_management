from rest_framework import serializers

class SolarDataSerializer(serializers.Serializer):
    energy = serializers.FloatField()
    battery = serializers.IntegerField()
