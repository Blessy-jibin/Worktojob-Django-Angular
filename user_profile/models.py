from django.db import models
from django.contrib.auth.models import User



class Redirect(models.Model):
	url = models.CharField(max_length=255)
	hash_value = models.CharField(db_index=True,max_length=128)
	created_at = models.DateTimeField(auto_now=True)

class JobInfo(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	job_title = models.CharField(max_length=255)
	url =  models.ForeignKey(Redirect, on_delete=models.CASCADE)
	stage = models.CharField(max_length=10)
	deadline = models.CharField(max_length=50)
	created_at = models.DateTimeField(auto_now=True)

class Task(models.Model):
	action = models.CharField(max_length=255)
	action_date = models.CharField(max_length=255)
	done = models.BooleanField(default=False)
	job = models.ForeignKey(JobInfo, related_name='tasks', on_delete=models.CASCADE)

class Feedback(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	feedback = models.CharField(max_length=500)
	created_at = models.DateTimeField(auto_now=True)

