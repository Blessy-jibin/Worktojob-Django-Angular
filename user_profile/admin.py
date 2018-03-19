from django.contrib import admin

from .models import JobDetails,Task,JobApplyDetails

admin.site.register(JobDetails)
admin.site.register(Task)
admin.site.register(JobApplyDetails)