from django.urls import path
from .views import (auth_login, JobInfoList, JobInfoDetail, UserCreate, 
					UserDetail, MetaParsing, ChangePasswordView, change_pwd, reset_password,
					ResetUserPassword)
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
	path('users', UserCreate.as_view(), name='user-detail'),
	# path('auth_login', views.auth_login, name='login'),
	path('auth_login',views.auth_login,name='auth_login'),
	path('login',views.login,name='login'),

	path('myjobs',views.add_job,name='adding jobs'),
	path('',views.home,name='default'),
	path('home',views.home,name='home'),

	path('job/view',views.job_list,name='job_list'),

	path('meta',MetaParsing.as_view(), name='meta'),

	path('change/password', ChangePasswordView.as_view(), name='change-pwd-detail'),
	path('reset/password', ResetUserPassword.as_view(), name='reset-pwd-detail'),
	path('change/pwd',views.change_pwd,name='change_pwd'),
	path('reset/pwd', views.reset_password, name='reset_password'),

    
]+static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS)

    