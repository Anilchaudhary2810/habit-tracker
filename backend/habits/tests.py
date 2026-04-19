import datetime

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from habits.models import DailyEntry, Habit, UserBadge
from habits.views import recalculate_user_stats


class HabitLogicTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='demo', password='pass12345')
        self.client.force_authenticate(user=self.user)

    def _create_habit(self, **overrides):
        today = timezone.localdate()
        defaults = {
            'user': self.user,
            'name': 'Read',
            'category': 'Study',
            'frequency': 'daily',
            'month': today.month,
            'year': today.year,
            'start_day': 1,
        }
        defaults.update(overrides)
        return Habit.objects.create(**defaults)

    def test_max_streak_uses_historical_data_not_only_current_window(self):
        today = timezone.localdate()
        habit = self._create_habit()
        run_start = today - datetime.timedelta(days=20)
        for i in range(7):
            DailyEntry.objects.create(habit=habit, date=run_start + datetime.timedelta(days=i), completed=True)

        recalculate_user_stats(self.user)
        self.user.refresh_from_db()

        self.assertEqual(self.user.max_streak, 7)
        self.assertEqual(self.user.current_streak, 0)
        self.assertEqual(self.user.points, 70)
        self.assertTrue(UserBadge.objects.filter(user=self.user, badge__threshold_days=7).exists())

    def test_deleting_habit_recalculates_points_and_streak(self):
        today = timezone.localdate()
        habit = self._create_habit(month=today.month, year=today.year)
        DailyEntry.objects.create(habit=habit, date=today, completed=True)
        recalculate_user_stats(self.user)
        self.user.refresh_from_db()
        self.assertEqual(self.user.points, 10)

        url = f'/api/habits/habits/{habit.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.user.refresh_from_db()
        self.assertEqual(self.user.points, 0)
        self.assertEqual(self.user.current_streak, 0)

    def test_partial_habit_update_validates_against_existing_month_year(self):
        habit = self._create_habit(month=2, year=2026, start_day=10)
        url = f'/api/habits/habits/{habit.id}/'
        response = self.client.patch(url, {'start_day': 30}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('start_day', response.data)

    def test_reposting_same_entry_updates_and_returns_200(self):
        today = timezone.localdate()
        habit = self._create_habit(month=today.month, year=today.year, start_day=1)
        payload = {'habit': habit.id, 'date': today.isoformat(), 'completed': True, 'note': 'Strong day'}

        first = self.client.post('/api/habits/entries/', payload, format='json')
        second = self.client.post('/api/habits/entries/', payload, format='json')

        self.assertEqual(first.status_code, status.HTTP_201_CREATED)
        self.assertEqual(second.status_code, status.HTTP_200_OK)
        self.assertEqual(DailyEntry.objects.filter(habit=habit, date=today).count(), 1)
        entry = DailyEntry.objects.get(habit=habit, date=today)
        self.assertEqual(entry.note, 'Strong day')

    def test_archive_and_unarchive_habit(self):
        habit = self._create_habit()

        archive_res = self.client.post(f'/api/habits/habits/{habit.id}/archive/')
        self.assertEqual(archive_res.status_code, status.HTTP_200_OK)

        list_res = self.client.get('/api/habits/habits/')
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_res.data), 0)

        archived_list = self.client.get('/api/habits/habits/?include_archived=1')
        self.assertEqual(len(archived_list.data), 1)
        self.assertTrue(archived_list.data[0]['is_archived'])

        unarchive_res = self.client.post(f'/api/habits/habits/{habit.id}/unarchive/')
        self.assertEqual(unarchive_res.status_code, status.HTTP_200_OK)

        list_res_after = self.client.get('/api/habits/habits/')
        self.assertEqual(len(list_res_after.data), 1)

    def test_insights_endpoint_returns_expected_shape(self):
        today = timezone.localdate()
        habit = self._create_habit(month=today.month, year=today.year, start_day=1)
        DailyEntry.objects.create(habit=habit, date=today, completed=True, note='Done')

        res = self.client.get('/api/habits/insights/?period=week')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('missed_days', res.data)
        self.assertIn('completion_rate', res.data)
        self.assertIn('best_weekday', res.data)
