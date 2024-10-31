from rest_framework import serializers
from .models import SponsoredPoll

class SponsoredPollSerializer(serializers.ModelSerializer):
    class Meta:
        model = SponsoredPoll
        fields = '__all__'
