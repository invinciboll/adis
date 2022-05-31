from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import render, redirect

from .forms import RoarForm
from . import models


# Create your views here.
def index(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            form = RoarForm(request.POST)
            if form.is_valid():
                roar = form.save(commit=False)
                print(request.user.id)
                roar.author = request.user
                roar.save()
        else:
            form = RoarForm()

        likes_list = list(models.Favourite.objects.values_list('roar_id', flat=True))
        favourites_of_user = list(models.Favourite.objects.filter(user=request.user).values_list('roar_id', flat=True))
        existing_roars = models.Roar.objects.all().order_by('-timestamp')
        for roar in existing_roars:
            roar.amount_of_likes = likes_list.count(roar.id)
            if roar.id in favourites_of_user:
                roar.liked = True
            else:
                roar.liked = False
        
        
        return render(request, 'roary/index.html', {'User': request.user, 'form': form, 'existing_roars': existing_roars, 'favourites_of_user':favourites_of_user})
    
    else:
        return redirect('/register')


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
            login(request, loggedInUser)
            return redirect('/')
    except Exception:
        print('Could not create Account')

    return render(request, 'roary/register.html')


def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

    try:
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('/')
    except Exception:
        print('Could not log in')

    return render(request, 'roary/login.html')

def user_logout(request):
    logout(request)
    return redirect('/')

def add_favourite(request, roar_id):
    if request.user.is_authenticated:
        try:
            roar = models.Roar.objects.get(pk=roar_id)
            favourite = models.Favourite.objects.create(roar=roar, user=request.user)
            favourite.save()
        except(Exception):
            print('Favourite appending failed')
    return redirect('/')

def remove_favourite(request, roar_id):
    if request.user.is_authenticated:
        try:
            roar = models.Roar.objects.get(pk=roar_id)
            favourite = models.Favourite.objects.filter(roar_id=roar, user_id=request.user)
            favourite.delete()
        except(Exception):
            print('Favourite removal failed')
    return redirect('/')