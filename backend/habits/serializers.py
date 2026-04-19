import calendar

from rest_framework import serializers
from .models import Habit, DailyEntry, Badge, UserBadge, Notification
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

    def validate(self, attrs):
        instance = getattr(self, 'instance', None)
        month = attrs.get('month', getattr(instance, 'month', None))
        year = attrs.get('year', getattr(instance, 'year', None))
        start_day = attrs.get('start_day', getattr(instance, 'start_day', None))
        frequency = attrs.get('frequency', getattr(instance, 'frequency', None))

        if month is not None and (month < 1 or month > 12):
            raise serializers.ValidationError({'month': 'Month must be between 1 and 12.'})

        if year is not None and (year < 2000 or year > 2100):
            raise serializers.ValidationError({'year': 'Year must be between 2000 and 2100.'})

        if month is not None and year is not None and start_day is not None:
            max_day = calendar.monthrange(year, month)[1]
            if start_day < 1 or start_day > max_day:
                raise serializers.ValidationError(
                    {'start_day': f'Start day must be between 1 and {max_day} for {month}/{year}.'}
                )

        if frequency == 'weekly' and start_day is not None and start_day > 28:
            raise serializers.ValidationError(
                {'start_day': 'For weekly habits, choose a start day between 1 and 28 for stable weekly cadence.'}
            )

        return attrs

class DailyEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyEntry
        fields = ('id', 'habit', 'date', 'completed', 'note')
        validators = []

    def validate(self, attrs):
        habit = attrs.get('habit') or getattr(self.instance, 'habit', None)
        date = attrs.get('date') or getattr(self.instance, 'date', None)

        if not habit or not date:
            return attrs

        if habit.is_archived:
            raise serializers.ValidationError({'habit': 'Cannot create entries for archived habits.'})

        if date.month != habit.month or date.year != habit.year:
            raise serializers.ValidationError(
                {'date': 'Entry date must be inside the habit month and year.'}
            )

        if date.day < habit.start_day:
            raise serializers.ValidationError(
                {'date': 'Entry date cannot be before the habit start day.'}
            )

        if habit.frequency == 'weekly' and (date.day - habit.start_day) % 7 != 0:
            raise serializers.ValidationError(
                {'date': 'Weekly habits can only be marked every 7 days from the start day.'}
            )

        if habit.frequency == 'monthly' and date.day != habit.start_day:
            raise serializers.ValidationError(
                {'date': 'Monthly habits can only be marked on the configured start day.'}
            )

        note = attrs.get('note')
        if note is not None and len(note) > 280:
            raise serializers.ValidationError({'note': 'Note must be 280 characters or fewer.'})

        return attrs

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)
    class Meta:
        model = UserBadge
        fields = ('badge', 'awarded_at')

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'points', 'current_streak', 'max_streak', 'is_staff')
