
from django.urls import path
from .views import (
    JobListView,
    JobDetailView,
    RecommendedJobsView,
    JobApplicationListCreateView,
    JobApplicationDetailView,
)

urlpatterns = [
    path('jobs/', JobListView.as_view(), name='job-list'),
    path('jobs/recommended/', RecommendedJobsView.as_view(), name='recommended-jobs'),
    path('jobs/<int:pk>/', JobDetailView.as_view(), name='job-detail'),

    path('applications/', JobApplicationListCreateView.as_view(), name='application-list'),
    path('applications/<int:pk>/', JobApplicationDetailView.as_view(), name='application-detail'),
]
