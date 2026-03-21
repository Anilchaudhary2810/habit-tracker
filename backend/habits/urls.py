from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HabitViewSet, DailyEntryViewSet, AnalyticsView, LeaderboardViewSet, NotificationViewSet

router = DefaultRouter()
router.register(r'habits', HabitViewSet, basename='habit')
router.register(r'entries', DailyEntryViewSet, basename='entry')
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
]
