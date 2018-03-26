from datetime import datetime
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault
from rest_framework.status import HTTP_401_UNAUTHORIZED

from django.db import transaction
from .models import JobInfo, Task


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email = validated_data["email"],
            username = validated_data["username"]
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ('action', 'action_date')


class JobInfoSerializer(serializers.ModelSerializer):

    created_at = serializers.DateTimeField(
                read_only=True,
                default=serializers.CreateOnlyDefault(datetime.now)
    )

    tasks = TaskSerializer(many=True)

    class Meta:
        model = JobInfo
        fields = ('id', 'job_title', 'job_url', 'created_at', 'tasks', 'deadline', 'stage')

    def create(self, validated_data):
        print("...............", validated_data)
        tasks_data = validated_data.pop('tasks')
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        else:
            raise HTTP_401_UNAUTHORIZED
        job_obj = JobInfo.objects.create(user=user, **validated_data)
        for task_data in tasks_data:
            dic_save = {'action_date': task_data.get('action_date'), 'action': task_data.get('action')}
            print ("------------------", dic_save)
            Task.objects.create(job=job_obj, **dic_save)
        return job_obj
