from django.urls import path
from .views import login, JobDetailsViewSet, TaskViewSet, JobApplyDetailsViewSet
from user_profile import views
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static

urlpatterns = [
	path('jobs', JobDetailsViewSet.as_view({'get': 'list'}), name='JobDetailsViewSet'),
	#path('jobs/<int:pk>', JobDetailsViewSet.as_view(), name='JobDetailsViewSet-detail'),
	path('task', TaskViewSet.as_view({'get': 'list'}), name='TaskViewSet'),
	#path('task/<int:pk>', TaskViewSet.as_view({'get': 'list'}), name='TaskViewSet-detail'),
	path('jobapply', JobApplyDetailsViewSet.as_view({'get': 'list'}), name='JobApplyDetailsViewSet'),
	#path('jobapply/<int:pk>', JobApplyDetailsViewSet.as_view(), name='JobApplyDetailsViewSet-detail'),
	# path('auth_login', views.auth_login, name='login'),
	path('login',views.login,name='login'),
	path('addjob',views.add_job,name='adding jobs')
    
]+static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    