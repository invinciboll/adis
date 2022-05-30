from django.shortcuts import render


# Create your views here.
def index(request):
    return render(request, 'roary/index.html')


def register(request):
    return render(request, 'roary/register.html')


def login(request):
    return render(request, 'roary/login.html')
