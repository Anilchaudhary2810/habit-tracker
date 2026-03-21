from rest_framework import serializers
from .models import Habit, DailyEntry, Badge, UserBadge
from accounts.models import User

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

class DailyEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyEntry
        fields = ('id', 'habit', 'date', 'completed')

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)
    class Meta:
        model = UserBadge
        fields = ('badge', 'awarded_at')

class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'points', 'current_streak', 'max_streak')
