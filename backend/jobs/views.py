
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db.models import Q

from accounts.models import UserProfile
from .models import Job, JobApplication
from .serializers import JobSerializer, JobApplicationSerializer
from .matching import calculate_job_match


class JobListView(generics.ListAPIView):
    serializer_class = JobSerializer

    def get_queryset(self):
        queryset = Job.objects.filter(
            is_active=True
        ).select_related('company')

        search = self.request.query_params.get('search')
        location = self.request.query_params.get('location')
        employment_type = self.request.query_params.get('employment_type')

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(company__name__icontains=search) |
                Q(skills__icontains=search) |
                Q(description__icontains=search)
            )

        if location:
            queryset = queryset.filter(location__icontains=location)

        if employment_type:
            queryset = queryset.filter(
                employment_type__iexact=employment_type
            )

        return queryset


class JobDetailView(generics.RetrieveAPIView):
    serializer_class = JobSerializer

    def get_queryset(self):
        return Job.objects.filter(
            is_active=True
        ).select_related('company')


class RecommendedJobsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(
            user=request.user
        )

        jobs = Job.objects.filter(
            is_active=True
        ).select_related('company')

        recommended_jobs = []

        for job in jobs:
            match_data = calculate_job_match(profile, job)

            job_data = JobSerializer(job).data
            job_data.update(match_data)

            recommended_jobs.append(job_data)

        recommended_jobs.sort(
            key=lambda job: job['match_percentage'],
            reverse=True
        )

        return Response(recommended_jobs)


class JobApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(
            user=self.request.user
        ).select_related('job', 'job__company')

    def perform_create(self, serializer):
        job = serializer.validated_data['job']

        already_exists = JobApplication.objects.filter(
            user=self.request.user,
            job=job
        ).exists()

        if already_exists:
            raise ValidationError(
                {'job_id': 'You are already tracking this job.'}
            )

        serializer.save(user=self.request.user)


class JobApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(
            user=self.request.user
        ).select_related('job', 'job__company')
