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
from .serializers import UserSerializer, JobInfoSerializer, TaskSerializer
from .models import JobInfo, Task
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
import requests
import re
import json

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
    print("test")

    username = request.data.get("username")
    password = request.data.get("password")
    print(username,password)
    user = authenticate(username=username, password=password)

    if not user:
        return Response({"error": "Login failed"}, status=HTTP_401_UNAUTHORIZED)
        print('not a user')
    token, created = Token.objects.get_or_create(user=user)
    print(token.key)

    return Response({"token": token.key})
    


@authentication_classes([TokenAuthentication])
@permission_classes([])
def login(request):
    #boards = Board.objects.all()
    print (request.user,request.user.is_authenticated)
    if(request.user.is_authenticated):

        return render_to_response('myjobs.html', locals())
    else:
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

class UserCreate(generics.CreateAPIView):

    serializer_class = UserSerializer
    authentication_classes = ()
    authentication_classes = ()

    def create(self, request, *args, **kwargs): # <- here i forgot self

        print("test")
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


class JobInfoList(generics.ListCreateAPIView):
    """
    List all jobinfo, or create a new jobinfo.
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = JobInfoSerializer

    def get_queryset(self):
        try:
            return JobInfo.objects.filter(user=self.request.user)
        except JobInfo.DoesNotExist:
            raise Http404


class JobInfoDetail(APIView):
    """
    Retrieve, update or delete a jobinfo instance.
    """
    permission_classes = (IsAuthenticated,)
    
    def get_object(self, pk):
        try:
            return JobInfo.objects.get(pk=pk)
        except JobInfo.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        job_info = self.get_object(pk)
        serializer = JobInfoSerializer(job_info)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        job_info = self.get_object(pk)
        print(job_info)
        serializer = JobInfoSerializer(job_info, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        job_info = self.get_object(pk)
        job_info.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TaskList(APIView):
    """
    List all jobinfo, or create a new jobinfo.
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        job_info = JobInfo.objects.all()
        serializer = TaskSerializer(job_info, many=True)
        return Response(serializer.data)

class MetaParsing (View):

     def get(self, request):
        meta = {}
        url = request.GET['url']
        print  (url)
        try:
            response = requests.get(url)
            content = response.content
            soup = BeautifulSoup(content, 'html.parser')
            title = soup.title.string 
            # dat = re.split(r'[`\-=~!@#$%^&*()_+\[\]{};\'\\:"|<,./<>?]', title)
            # if dat:
            #     job = dat[0]
            #     meta['title'] = str(job)
            meta['title'] = str(title)
            print ("dat-------", meta)
            return HttpResponse(json.dumps(meta))
        except:
            meta = {}
            return HttpResponse(json.dumps(meta))



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
    








