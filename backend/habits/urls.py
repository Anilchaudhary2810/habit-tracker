from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HabitViewSet, DailyEntryViewSet, AnalyticsView, LeaderboardViewSet

router = DefaultRouter()
router.register(r'habits', HabitViewSet, basename='habit')
router.register(r'entries', DailyEntryViewSet, basename='entry')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')

urlpatterns = [
    path('', include(router.urls)),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
]
