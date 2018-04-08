from datetime import datetime
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault
from rest_framework.status import HTTP_401_UNAUTHORIZED

from django.db import transaction
from .models import JobInfo, Task, Feedback, Redirect
import hashlib


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ('feedback',)

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user
        return Feedback.objects.create(user=user, **validated_data)

        
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

class ResetPasswordSerializer(serializers.ModelSerializer):
    """
    Serializer for password change endpoint.
    """
    email = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('email')


class ChangePasswordSerializer(serializers.ModelSerializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('old_password', 'new_password')
 
class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ('action', 'action_date','done')


class RedirectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Redirect
        fields = ('id','hash_value',)

        

class JobInfoSerializer(serializers.ModelSerializer):

    created_at = serializers.DateTimeField(
                read_only=True,
                default=serializers.CreateOnlyDefault(datetime.now)
    )
    job_url = serializers.CharField( write_only=True)
    url =  RedirectSerializer( read_only=True)

    class Meta:
        model = JobInfo
        fields = ('id','job_url','job_title','url', 'created_at', 'tasks', 'deadline', 'stage')

    tasks = TaskSerializer(many=True)

    def create(self, validated_data):
        tasks_data = validated_data.pop('tasks')
        request = self.context.get("request")
        user = request.user
        job_url = validated_data.pop('job_url');
        url_hash = hashlib.md5(job_url.encode('utf-8')).hexdigest()[:8]
        url_dic = {'url': job_url,'hash_value':url_hash}
        urlObj = Redirect.objects.create(**url_dic)

        job_obj = JobInfo.objects.create(user=user, url =urlObj, **validated_data)
        for task_data in tasks_data:
            dic_save = {'action_date': task_data.get('action_date'), 'action': task_data.get('action'),'done':task_data.get('done')}
            Task.objects.create(job=job_obj, **dic_save)

        print (job_obj,"Done")
        return job_obj

    def update(self,job,validated_data):
        job.job_title = validated_data.pop('job_title')
        job.deadline = validated_data.pop('deadline')
        job.stage = validated_data.pop('stage')
        tasks = Task.objects.filter(job=job)
        for task in tasks:
            task.delete()

        for task in validated_data.pop('tasks'):
            dic_save = {'action_date': task.get('action_date'), 'action': task.get('action'),'done':task.get('done')}
            Task.objects.create(job=job, **dic_save)
        job.save()
        return job

       
