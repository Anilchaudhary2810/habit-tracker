from django.contrib import admin
from .models import Habit, DailyEntry, Badge, UserBadge

@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'category', 'frequency', 'month', 'year')
    list_filter = ('category', 'frequency', 'month', 'year', 'user')
    search_fields = ('name', 'user__username')

@admin.register(DailyEntry)
class DailyEntryAdmin(admin.ModelAdmin):
    list_display = ('habit', 'date', 'completed')
    list_filter = ('completed', 'date')
    search_fields = ('habit__name', 'habit__user__username')

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('name', 'threshold_days')

@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'awarded_at')
