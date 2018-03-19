from django.db import models
from django.contrib.auth.models import User


class JobDetails(models.Model):
	job_title = models.CharField(max_length=255)
	job_url = models.TextField()
	created_date = models.DateTimeField(auto_now=True)


class Task(models.Model):
	action = models.CharField(max_length=255)
	date = models.DateTimeField(auto_now=True)


class JobApplyDetails(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	task = models.ManyToManyField(Task)
	action = models.CharField(max_length=255)
	date = models.DateTimeField(auto_now=True)

