from django.db import models
from django.contrib.auth.models import User


class JobInfo(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	job_title = models.CharField(max_length=255)
	job_url = models.TextField()
	stage = models.CharField(max_length=255)
	deadline = models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now=True)


class Task(models.Model):
	action = models.CharField(max_length=255)
	action_date = models.CharField(max_length=255)
	job = models.ForeignKey(JobInfo, related_name='tasks', on_delete=models.CASCADE)

