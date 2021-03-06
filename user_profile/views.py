from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view,  authentication_classes, permission_classes
from rest_framework.response import Response
from django.http import HttpResponse
from django.views.generic import View
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

from rest_framework.status import HTTP_401_UNAUTHORIZED
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .serializers import ( UserSerializer,FeedbackSerializer,JobInfoSerializer, TaskSerializer, 
                          ChangePasswordSerializer, ResetPasswordSerializer,RedirectSerializer,
                          MetaSerializer)
from .models import JobInfo, Task, Redirect
#for activating the static file such as s and css i have include dthe below line
from django.shortcuts import render_to_response
from django.http import Http404
from rest_framework.views import APIView
from rest_framework import generics

from rest_framework.response import Response
from rest_framework import status 
from bs4 import BeautifulSoup
from django.contrib.auth.models import User
from urllib.request import urlopen

from django.core.mail import send_mail
from django.core.mail import EmailMessage
import string
import random

import requests
import re
import json
import base64
import os
import urllib.parse as urlparse
from django.conf import settings
from datetime import datetime
from selenium import webdriver
import sys;
import hashlib


DRIVER = settings.BASE_DIR+'/chrome_server/chromedriver'

#usage example

"""
url = "http://127.0.0.1:8000/login"
d = {'username': 'admin', 'password': 'ruckus1!'}
s = requests.post(url, data=d)

auth_headers = {
 'Authorization': 'Token ' + '6aa42e8225a9c4b6f5e610bffdfb4746d816f96b'
}
s = requests.get(url, headers=auth_headers)

>>> url = "http://127.0.0.1:8000/jobs"
>>> s = requests.get(url, headers=auth_headers)
>>> s.text
u'[{"id":1,"job_title":"Python Developer","job_url":"bcghfchc","created_date":"2018-03-18T13:30:16.421931Z"},{"id":2,"job_title":"asdasdsad","job_url":"vjgvjvvnvh","created_date":"2018-03-18T13:30:22.344968Z"}]'

"""

@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def auth_login(request):

    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if not user:
        return Response({"error": "Login failed"}, status=HTTP_401_UNAUTHORIZED)
    token, created = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})
    


@authentication_classes([TokenAuthentication])
@permission_classes([])
def login(request):
    #boards = Board.objects.all()    
    return render_to_response('auth.html', locals())  

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def home(request):
    #boards = Board.objects.all()
    return render_to_response('myjobs.html',locals())

@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def job_list(request):
    #boards = Board.objects.all()
    return render_to_response('jobs.html')

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_job(request):
    return render_to_response('myjobs.html', locals())

def get_random_pwd(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))
def change_pwd(request):
    return render_to_response('change_pwd.html')

def reset_password(request):
    return render_to_response('reset.html')

def redirect_link(request):
    return redirect(object)


class RedirectView:
   
    serializer_class =RedirectSerializer
    authentication_classes = ()
    authentication_classes = ()

    def get(self, request, hash, format=None):
        url = request.GET['id']
        redirect_to = Redirect.objects.get(pk=id)
        return HttpResponseRedirect(redirect_to=redirect_to)

class Feedback(generics.CreateAPIView):

    serializer_class = FeedbackSerializer
    permission_classes = (IsAuthenticated,)
   

class UserCreate(generics.CreateAPIView):

    serializer_class = UserSerializer
    authentication_classes = ()
    authentication_classes = ()

    def create(self, request, *args, **kwargs): # <- here i forgot self
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        token, created = Token.objects.get_or_create(user=serializer.instance)
        return Response({'token': token.key}, headers=headers)


class UserDetail(generics.RetrieveAPIView):
    """
    Retrieve a User
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ChangePasswordView(generics.UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response("Success.", status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ResetUserPassword(generics.CreateAPIView):
    """
    Reset password.
    """
    serializer_class = ResetPasswordSerializer
    authentication_classes = ()

    def post(self, request, format=None):
        data = request.data.get('email')
        msg = """
            <!DOCTYPE html>
            <html>
            <head>
            </head>

            <body style="font-family: Arial; font-size: 12px;">
            <div>
                <p>
                    You have requested a password reset, please find the new password.
                </p>
                <p>
                </p>

                <p>
                    <p>UserName: %s</p>
                    <p>Password: %s</p>
                </p>
            </div>
            </body>
            </html>
        """
        try:
            user_data = User.objects.get(username=data)
            random_pwd = get_random_pwd()
            d = user_data.set_password(random_pwd)
            user_data.save()
            msg = EmailMessage(
                'WRK Password Reset',
                 msg % (user_data.email, random_pwd),
                'pezsovi@gmail.com',
                [user_data.email],
            )
            msg.content_subtype = 'html'
            msg.send()
            return Response('password sent to email', status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response('Email is not registred with us', status=status.HTTP_400_BAD_REQUEST)


class JobList(generics.ListCreateAPIView):
    """
    List all jobinfo, or create a new jobinfo.
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = JobInfoSerializer

    def get_queryset(self):
        print ("Reached");
        try:
            return JobInfo.objects.filter(user=self.request.user)
        except JobInfo.DoesNotExist:
            raise Http404


class TaskList(APIView):
    """
    List all jobinfo, or create a new jobinfo.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        job_info = JobInfo.objects.all()
        serializer = TaskSerializer(job_info, many=True)
        return Response(serializer.data)

class MetaParsing (APIView):

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        image_url = ''
        url = request.GET['url']
        if 'http' not in url:
            url = 'https://'+ url
        url_hash = hashlib.md5(url.encode('utf-8')).hexdigest()[:8]
        if(sys.argv[1] != 'runserver'):
            img_data = get_screenshot(url)
            image_url = img_data.get('image_url', '')   
        title = '';
        urlObj = Redirect.objects.create(url=url,hash_value=url_hash,img=image_url)
      

        try:
            response = requests.get(url)
            content = response.content
            soup = BeautifulSoup(content, 'html.parser')
            title = soup.title.string 
        except Exception as e:
            print ('.........', e)

        meta= Meta (url_id=urlObj.pk, url=url,img=image_url,hash_value=url_hash,title=title)
        serializer = MetaSerializer(meta)
        return Response(serializer.data)


class Meta(object):
    def __init__(self, url_id,  url, img,hash_value,title):
        self.url = url
        self.img = img
        self.hash_value = hash_value 
        self.title = title
        self.url_id = url_id 


class JobInfoDetail(APIView):
    """
    Retrieve, update or delete a jobinfo instance.
    """
    def get_object(self, pk):
        try:
            return JobInfo.objects.get(pk=pk)
        except JobInfo.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        job_info = self.get_object(pk)
        console.log(job_info.job_url)
        serializer = JobInfoSerializer(job_info)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        job_info = self.get_object(pk)
        serializer = JobInfoSerializer(job_info, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        job_info = self.get_object(pk)
        job_info.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

def get_screenshot(url):
    """
    Take a screenshot and return a png file based on the url.
    """
    width = 1124
    height = 768
    if url is not None and url != '':
        params = urlparse.parse_qs(urlparse.urlparse(url).query)
        if len(params) > 0:
            if 'w' in params: width = int(params['w'][0])
            if 'h' in params: height = int(params['h'][0])
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('headless')
        driver = webdriver.Chrome(executable_path=DRIVER, options=chrome_options)
        driver.get(url)
        driver.set_window_size(width, height)
        now = str(datetime.today().timestamp())
        img_dir = settings.STATICFILES_DIRS[0]+'/screenshot'
        img_name = ''.join([now, '_image.png'])
        full_img_path = os.path.join(img_dir, img_name)
        if not os.path.exists(img_dir):
            os.makedirs(img_dir)
        
        driver.save_screenshot(full_img_path)
        screenshot = open(full_img_path, 'rb').read()
        var_dict = {'screenshot': img_name, 'save': True}
        driver.quit()    
        return {'image_url': '/static/screenshot/'+img_name, 'status': True}
    else:
        return {'image_url': '', 'status': False}

