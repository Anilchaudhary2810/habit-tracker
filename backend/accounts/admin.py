from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'points', 'current_streak', 'max_streak', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Habit Statistics', {'fields': ('points', 'current_streak', 'max_streak')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Habit Statistics', {'fields': ('points', 'current_streak', 'max_streak')}),
    )
