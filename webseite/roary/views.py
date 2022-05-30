from django.contrib.auth import authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.shortcuts import render, redirect


# Create your views here.
def index(request):
    return render(request, 'roary/index.html')


def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

    try:
        user = User.objects.create_user(username, email, password)
        user.save()

        loggedInUser = authenticate(username=username, password=password)
        if loggedInUser is not None:
            return redirect('/')
    except Exception:
        print('Could not create Account')

    return render(request, 'roary/register.html')


def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

    try:
        user = authenticate(username=username, password=password)
        if user is not None:
            return redirect('/')
    except Exception:
        print('Could not log in')

    return render(request, 'roary/login.html')
