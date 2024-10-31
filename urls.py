from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SponsoredPollViewSet

router = DefaultRouter()
router.register(r'sponsored-polls', SponsoredPollViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
