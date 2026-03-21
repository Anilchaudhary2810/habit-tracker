import datetime
from django.db.models import Count
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from .models import Habit, DailyEntry, Badge, UserBadge, Notification
from .serializers import (
    HabitSerializer, DailyEntrySerializer, BadgeSerializer, 
    UserBadgeSerializer, LeaderboardSerializer, NotificationSerializer
)
from accounts.models import User

class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DailyEntryViewSet(viewsets.ModelViewSet):
    serializer_class = DailyEntrySerializer
    
    def get_queryset(self):
        return DailyEntry.objects.filter(habit__user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        habit = serializer.validated_data['habit']
        if habit.user != self.request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        entry, created = DailyEntry.objects.update_or_create(
            habit=habit,
            date=serializer.validated_data['date'],
            defaults={'completed': serializer.validated_data['completed']}
        )
        
        # Recalculate User Stats
        self.update_user_stats(self.request.user)
        return Response(DailyEntrySerializer(entry).data, status=status.HTTP_201_CREATED)

    def update_user_stats(self, user):
        # Points: +10 for each completion
        total_completed = DailyEntry.objects.filter(habit__user=user, completed=True).count()
        user.points = total_completed * 10
        
        # Streak Calculation
        today = datetime.date.today()
        streak = 0
        current_date = today
        
        # Check if any habit completed today
        has_completed_today = DailyEntry.objects.filter(habit__user=user, date=today, completed=True).exists()
        
        if not has_completed_today:
            # If nothing today, start checking from yesterday
            current_date = today - datetime.timedelta(days=1)
            
        while True:
            if DailyEntry.objects.filter(habit__user=user, date=current_date, completed=True).exists():
                streak += 1
                current_date -= datetime.timedelta(days=1)
            else:
                break
        
        user.current_streak = streak
        if streak > user.max_streak:
            user.max_streak = streak
            
        user.save()
        self.check_badges(user)

    def check_badges(self, user):
        # Default streaks
        Badge.objects.get_or_create(name="1 Day Streak", threshold_days=1, defaults={"description": "Beginning of a journey", "icon": "star"})
        Badge.objects.get_or_create(name="7 Day Streak", threshold_days=7, defaults={"description": "Consistency is key", "icon": "flame"})
        Badge.objects.get_or_create(name="30 Day Streak", threshold_days=30, defaults={"description": "Habit master", "icon": "trophy"})
        
        badges = Badge.objects.filter(threshold_days__lte=user.current_streak)
        for badge in badges:
            if not UserBadge.objects.filter(user=user, badge=badge).exists():
                UserBadge.objects.create(user=user, badge=badge)
                # Create Notification
                Notification.objects.create(
                    user=user,
                    title="🎉 Achievement Unlocked!",
                    message=f"You've earned the '{badge.name}' badge for your {user.current_streak} day streak!",
                    notification_type='achievement'
                )

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"status": "success"})

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({"status": "success"})

class AnalyticsView(APIView):
    def get(self, request):
        user = request.user
        month = request.query_params.get('month', datetime.date.today().month)
        year = request.query_params.get('year', datetime.date.today().year)
        
        entries = DailyEntry.objects.filter(
            habit__user=user,
            date__month=month,
            date__year=year,
            completed=True
        ).values('date').annotate(count=Count('id')).order_by('date')
        
        return Response(list(entries))

class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by('-current_streak', '-points')[:10]
    serializer_class = LeaderboardSerializer
    permission_classes = (permissions.AllowAny,)
