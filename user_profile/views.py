from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
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
from django.contrib.auth.models import User
# from bs4 import BeautifulSoup
from urllib.request import urlopen
import requests
import re

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
def auth_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if not user:
        return Response({"error": "Login failed"}, status=HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})

def login(request):
    #boards = Board.objects.all()
    return render_to_response('login.html', locals())

def home(request):
    #boards = Board.objects.all()
    return render_to_response('auth.html')

def job_list(request):
    #boards = Board.objects.all()
    return render_to_response('jobs.html')

def add_job(request):
    return render_to_response('addjob.html', locals())


class UserCreate(generics.CreateAPIView):
    """
    Create a User
    """
    serializer_class = UserSerializer
    authentication_classes = ()
    permission_classes = ()


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

class MetaParsing (APIView):

     def get(self, request,format=None):
        meta = {}
        try:
            url = request.GET.get('url')
            print  (url)
            # content = urlopen(url)
            headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
            response = requests.get(url, headers=headers)
            content = response.content
            
            soup = BeautifulSoup(content, 'html.parser')
            print ( content,soup.title,response.status_code);

            title = soup.title.string 
            dat = re.split(r"[\[\]]", title)
            if (dat[0] is not null ):
                job = dat[0]
            if (dat[1] is not null ):
                company = dat[1]
            meta = { 'job' : dat.string , 'company' :company }
            print (meta);

        except Exception as e:
            print  ('except',e)

        return Response(meta)


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
    








