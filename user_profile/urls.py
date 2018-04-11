from django.urls import path
from .views import (auth_login, JobList, JobInfoDetail, UserCreate, 
					UserDetail, MetaParsing, ChangePasswordView, change_pwd, reset_password,
					ResetUserPassword,Feedback ,RedirectView)
from user_profile import views
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static

urlpatterns = [
	

	path('auth_login',views.auth_login,name='auth_login'),
	path('login',views.login,name='login'),
	path('',views.home,name='default'),
	path('home',views.home,name='home'),
    # url(r'^logout/$', auth_views.logout, {'next_page': '/'},name='logout'),


	path('jobs', JobList.as_view(), name='job_info_list_create'),
	path('job/<int:pk>', JobInfoDetail.as_view(), name='job_info-detail'),
	path('create_user', UserCreate.as_view(), name='user_view'),

	path('meta',MetaParsing.as_view(), name='meta'),
	path('link/<string>', views.RedirectView, name='feedback'),

	path('change/password', ChangePasswordView.as_view(), name='change-pwd-detail'),
	path('reset/password', ResetUserPassword.as_view(), name='reset-pwd-detail'),
	path('feedback', Feedback.as_view(), name='feedback'),
	path('change/pwd', views.change_pwd, name='reset-pwd-detail'),
	path('reset/pwd', views.reset_password, name='reset-pwd-detail'),

    
]+static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS)

    