from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .serializers import JobDetailsSerializer, TaskSerializer, JobApplyDetailsSerializer
from .models import JobDetails, Task, JobApplyDetails
#for activating the static file such as s and css i have include dthe below line
from django.shortcuts import render_to_response

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

# @api_view(["POST"])
def auth_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    print (username, password)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({"error": "Login failed"}, status=HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})

def login(request):
    #boards = Board.objects.all()
    return render_to_response('login.html', locals())
def add_job(request):
    return render_to_response('addjob.html', locals())




class JobDetailsViewSet(viewsets.ModelViewSet):
    serializer_class = JobDetailsSerializer
    queryset = JobDetails.objects.all()
    permission_classes = (IsAuthenticated,)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = (IsAuthenticated,)


class JobApplyDetailsViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplyDetailsSerializer
    queryset = JobApplyDetails.objects.all()
    permission_classes = (IsAuthenticated,)






