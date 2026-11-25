
from django.db import models
from django.contrib.auth.models import User


class Job(models.Model):
    company = models.ForeignKey(
        'startups.Company',
        on_delete=models.CASCADE,
        related_name='jobs'
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    skills = models.TextField(blank=True)
    experience = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=255, blank=True)
    employment_type = models.CharField(max_length=100, blank=True)
    salary_min = models.PositiveIntegerField(null=True, blank=True)
    salary_max = models.PositiveIntegerField(null=True, blank=True)
    application_url = models.URLField()
    posted_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.company.name}"


class JobApplication(models.Model):

    STATUS_CHOICES = [
        ('wishlisted', 'Wishlisted'),
        ('applied', 'Applied'),
        ('interview', 'Interview'),
        ('offer', 'Offer'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='job_applications'
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='applications'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='wishlisted'
    )

    notes = models.TextField(blank=True)

    applied_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return f"{self.user.username} - {self.job.title} ({self.status})"
