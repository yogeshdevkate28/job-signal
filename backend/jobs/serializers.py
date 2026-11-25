
from rest_framework import serializers
from .models import Job, JobApplication


class JobSerializer(serializers.ModelSerializer):
    company = serializers.CharField(
        source='company.name',
        read_only=True
    )

    class Meta:
        model = Job
        fields = '__all__'


class JobApplicationSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(),
        source='job',
        write_only=True
    )

    class Meta:
        model = JobApplication
        fields = [
            'id',
            'job_id',
            'job_details',
            'status',
            'notes',
            'applied_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
        ]
