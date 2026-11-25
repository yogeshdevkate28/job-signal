
from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    full_name = models.CharField(max_length=150, blank=True)

    resume = models.FileField(
        upload_to='resumes/',
        blank=True,
        null=True
    )

    skills = models.JSONField(default=list, blank=True)

    desired_roles = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resume_text = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
