
from django.contrib.auth.models import User
from rest_framework import serializers
import uuid
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    skills = serializers.JSONField(required=False)
    desired_roles = serializers.JSONField(required=False)
    remove_resume = serializers.BooleanField(
        write_only=True,
        required=False
    )

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'email',
            'full_name',
            'resume',
            'remove_resume',
            'skills',
            'desired_roles',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_resume(self, file):
        if file:
            allowed_extensions = ['.pdf', '.docx']
            extension = file.name.lower().rsplit('.', 1)

            if len(extension) < 2 or f'.{extension[-1]}' not in allowed_extensions:
                raise serializers.ValidationError(
                    'Only PDF and DOCX files are allowed.'
                )

            if file.size > 5 * 1024 * 1024:
                raise serializers.ValidationError(
                    'File size cannot exceed 5 MB.'
                )

        return file

    

def update(self, instance, validated_data):
    from .utils import extract_resume_text

    remove_resume = validated_data.pop('remove_resume', False)
    new_resume = validated_data.get('resume')

    if remove_resume and instance.resume:
        instance.resume.delete(save=False)
        instance.resume = None
        instance.resume_text = ""

    elif new_resume:
        instance.resume_text = extract_resume_text(new_resume)
        new_resume.seek(0)

    return super().update(instance, validated_data)





class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop('username')
        self.fields['email'] = serializers.EmailField()

    def validate(self, attrs):
        try:
            user = User.objects.get(email__iexact=attrs['email'])
        except User.DoesNotExist:
            raise AuthenticationFailed('Invalid email or password.')

        return super().validate({
            'username': user.username,
            'password': attrs['password']
        })


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, read_only=True)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        email = validated_data['email']

        user = User.objects.create_user(
            username=f"user_{uuid.uuid4().hex[:12]}",
            email=email,
            password=validated_data['password']
        )

        return user
