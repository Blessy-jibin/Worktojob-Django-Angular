from django.contrib.auth.models import User
from rest_framework import serializers
from django.db import transaction
from .models import JobDetails, Task, JobApplyDetails



class JobDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobDetails
        fields = ('id', 'job_title', 'job_url', 'created_date')


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ('id', 'action', 'date')


class JobApplyDetailsSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)    
 
    class Meta:
        model = JobApplyDetails

