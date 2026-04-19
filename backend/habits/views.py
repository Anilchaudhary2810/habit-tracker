import datetime
import calendar

from django.db.models import Count
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User
from .models import Badge, DailyEntry, Habit, Notification, UserBadge
from .serializers import (
    DailyEntrySerializer,
    HabitSerializer,
    LeaderboardSerializer,
    NotificationSerializer,
)


def _is_entry_valid_for_habit(habit, entry_date):
    if habit.is_archived:
        return False
    if entry_date.year != habit.year or entry_date.month != habit.month:
        return False
    if entry_date.day < habit.start_day:
        return False
    if habit.frequency == 'daily':
        return True
    if habit.frequency == 'weekly':
        return (entry_date.day - habit.start_day) % 7 == 0
    if habit.frequency == 'monthly':
        return entry_date.day == habit.start_day
    return False


def _get_period_window(period, today):
    if period == 'today':
        return today, today
    if period == 'week':
        start = today - datetime.timedelta(days=6)
        return start, today
    # month default
    return today.replace(day=1), today


def _weekday_name(weekday_number):
    return calendar.day_name[weekday_number]


def recalculate_user_stats(user):
    completed_dates = list(
        DailyEntry.objects.filter(habit__user=user, completed=True)
        .values_list('date', flat=True)
        .distinct()
    )
    completed_set = set(completed_dates)
    user.points = len(completed_dates) * 10

    # Current streak: contiguous completion days counting backward from today.
    today = timezone.localdate()
    streak = 0
    check_date = today if today in completed_set else today - datetime.timedelta(days=1)
    while check_date in completed_set:
        streak += 1
        check_date -= datetime.timedelta(days=1)
    user.current_streak = streak

    # Max streak: longest historical contiguous run.
    max_streak = 0
    if completed_dates:
        sorted_dates = sorted(completed_set)
        run = 1
        max_streak = 1
        for idx in range(1, len(sorted_dates)):
            if sorted_dates[idx] == sorted_dates[idx - 1] + datetime.timedelta(days=1):
                run += 1
            else:
                run = 1
            if run > max_streak:
                max_streak = run
    user.max_streak = max_streak
    user.save(update_fields=['points', 'current_streak', 'max_streak'])
    check_badges(user)


def check_badges(user):
    Badge.objects.get_or_create(
        name='1 Day Streak',
        threshold_days=1,
        defaults={'description': 'Beginning of a journey', 'icon': 'star'},
    )
    Badge.objects.get_or_create(
        name='7 Day Streak',
        threshold_days=7,
        defaults={'description': 'Consistency is key', 'icon': 'flame'},
    )
    Badge.objects.get_or_create(
        name='30 Day Streak',
        threshold_days=30,
        defaults={'description': 'Habit master', 'icon': 'trophy'},
    )

    eligible_badges = Badge.objects.filter(threshold_days__lte=user.max_streak)
    for badge in eligible_badges:
        _, created = UserBadge.objects.get_or_create(user=user, badge=badge)
        if created:
            Notification.objects.create(
                user=user,
                title='Achievement Unlocked',
                message=f"You've earned the '{badge.name}' badge.",
                notification_type='achievement',
            )


class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer

    def get_queryset(self):
        queryset = Habit.objects.filter(user=self.request.user)
        include_archived = self.request.query_params.get('include_archived')
        if include_archived not in ('1', 'true', 'True'):
            queryset = queryset.filter(is_archived=False)
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        habit = serializer.save()
        DailyEntry.objects.filter(habit=habit).exclude(
            date__year=habit.year, date__month=habit.month
        ).delete()

        remaining_entries = DailyEntry.objects.filter(habit=habit)
        invalid_ids = [entry.id for entry in remaining_entries if not _is_entry_valid_for_habit(habit, entry.date)]
        if invalid_ids:
            DailyEntry.objects.filter(id__in=invalid_ids).delete()

        recalculate_user_stats(habit.user)

    def perform_destroy(self, instance):
        user = instance.user
        instance.delete()
        recalculate_user_stats(user)

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        habit = self.get_object()
        if not habit.is_archived:
            habit.is_archived = True
            habit.save(update_fields=['is_archived'])
        return Response({'status': 'archived'})

    @action(detail=True, methods=['post'])
    def unarchive(self, request, pk=None):
        habit = Habit.objects.filter(user=request.user, pk=pk).first()
        if not habit:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        if habit.is_archived:
            habit.is_archived = False
            habit.save(update_fields=['is_archived'])
        return Response({'status': 'active'})


class DailyEntryViewSet(viewsets.ModelViewSet):
    serializer_class = DailyEntrySerializer

    def get_queryset(self):
        queryset = DailyEntry.objects.filter(habit__user=self.request.user, habit__is_archived=False)
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')

        if month and month.isdigit():
            month_num = int(month)
            if 1 <= month_num <= 12:
                queryset = queryset.filter(date__month=month_num)

        if year and year.isdigit():
            year_num = int(year)
            if 2000 <= year_num <= 2100:
                queryset = queryset.filter(date__year=year_num)

        return queryset.order_by('date')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        habit = serializer.validated_data['habit']
        if habit.user != self.request.user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        entry, created = DailyEntry.objects.update_or_create(
            habit=habit,
            date=serializer.validated_data['date'],
            defaults={
                'completed': serializer.validated_data['completed'],
                'note': serializer.validated_data.get('note', ''),
            },
        )

        recalculate_user_stats(self.request.user)
        response_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(DailyEntrySerializer(entry).data, status=response_status)

    def perform_update(self, serializer):
        entry = serializer.save()
        recalculate_user_stats(entry.habit.user)

    def perform_destroy(self, instance):
        user = instance.habit.user
        instance.delete()
        recalculate_user_stats(user)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'success'})

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        return Response({'status': 'success'})


class AnalyticsView(APIView):
    def get(self, request):
        user = request.user
        today = timezone.localdate()
        period = request.query_params.get('period', 'month')
        start_date, end_date = _get_period_window(period, today)

        entries = (
            DailyEntry.objects.filter(
                habit__user=user,
                habit__is_archived=False,
                date__gte=start_date,
                date__lte=end_date,
                completed=True,
            )
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        return Response(list(entries))


class InsightsView(APIView):
    def get(self, request):
        user = request.user
        today = timezone.localdate()
        period = request.query_params.get('period', 'week')
        start_date, end_date = _get_period_window(period, today)

        active_habits = list(Habit.objects.filter(user=user, is_archived=False))
        days = [
            start_date + datetime.timedelta(days=offset)
            for offset in range((end_date - start_date).days + 1)
        ]

        completed_entries = DailyEntry.objects.filter(
            habit__user=user,
            habit__is_archived=False,
            completed=True,
            date__gte=start_date,
            date__lte=end_date,
        )
        completed_dates = set(completed_entries.values_list('date', flat=True))

        missed_days = 0
        total_expected = 0
        total_completed = completed_entries.count()
        for day in days:
            expected_for_day = sum(1 for habit in active_habits if _is_entry_valid_for_habit(habit, day))
            if expected_for_day > 0 and day not in completed_dates:
                missed_days += 1
            total_expected += expected_for_day

        completion_rate = round((total_completed / total_expected) * 100, 1) if total_expected else 0.0

        weekday_counts = (
            DailyEntry.objects.filter(habit__user=user, completed=True)
            .values('date__week_day')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        best_weekday = None
        best_weekday_count = 0
        if weekday_counts:
            # Django week_day: 1=Sunday ... 7=Saturday
            wk = weekday_counts[0]['date__week_day']
            best_weekday = _weekday_name((wk + 5) % 7)
            best_weekday_count = weekday_counts[0]['count']

        return Response(
            {
                'period': period,
                'missed_days': missed_days,
                'completion_rate': completion_rate,
                'best_weekday': best_weekday,
                'best_weekday_count': best_weekday_count,
                'total_completed': total_completed,
                'total_expected': total_expected,
            }
        )


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by('-current_streak', '-points')[:10]
    serializer_class = LeaderboardSerializer
    permission_classes = (permissions.AllowAny,)
