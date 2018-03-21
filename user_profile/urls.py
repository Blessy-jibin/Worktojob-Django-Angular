from django.urls import path
from .views import (auth_login, JobInfoList, JobInfoDetail, UserCreate, UserDetail)
from user_profile import views
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static

urlpatterns = [
	path('jobs', JobInfoList.as_view(), name='job_info_list_create'),
	path('job/<int:pk>', JobInfoDetail.as_view(), name='job_info-detail'),
	#path('task', TaskViewSet.as_view({'get': 'list'}), name='TaskViewSet'),
	#path('task/<int:pk>', TaskViewSet.as_view({'get': 'list'}), name='TaskViewSet-detail'),
	path('create_user', UserCreate.as_view(), name='user_view'),
	path('users/<int:pk>', UserCreate.as_view(), name='user-detail'),
	# path('auth_login', views.auth_login, name='login'),
	path('login',views.auth_login,name='login'),
	path('addjob',views.add_job,name='adding jobs')

    
]+static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    