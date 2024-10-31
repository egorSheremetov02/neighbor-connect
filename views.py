from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SponsoredPoll
from .serializers import SponsoredPollSerializer
from django.db.models import F

class SponsoredPollViewSet(viewsets.ModelViewSet):
    queryset = SponsoredPoll.objects.all()
    serializer_class = SponsoredPollSerializer

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        poll = self.get_object()
        option = request.data.get('option')
        
        if option not in poll.options:
            return Response({'error': 'Invalid option'}, status=400)
        
        # Record the vote
        if 'votes' not in poll.options:
            poll.options['votes'] = {opt: 0 for opt in poll.options}
        poll.options['votes'][option] += 1
        poll.save()

        # Gather engagement data
        results = poll.options['votes']
        
        return Response({'message': 'Vote recorded', 'offer': poll.offer, 'results': results})
