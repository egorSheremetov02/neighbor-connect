from django.db import models

class SponsoredPoll(models.Model):
    question = models.CharField(max_length=255)
    options = models.JSONField()
    business_name = models.CharField(max_length=255)
    offer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
