from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.forms import model_to_dict
from django.http import HttpResponse
from django.shortcuts import render, redirect
import json

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

def remove_favourite_from_favourites_page(request, roar_id):
    if request.user.is_authenticated:
        try:
            roar = models.Roar.objects.get(pk=roar_id)
            favourite = models.Favourite.objects.filter(roar_id=roar, user_id=request.user)
            favourite.delete()
        except(Exception):
            print('Favourite removal failed')
    return redirect('favourites/')

def my_favourites(request):
    if request.user.is_authenticated:
        # try:
            favourites_of_user = list(models.Favourite.objects.filter(user=request.user).values_list('roar_id', flat=True))
            # favourite_roars = []
            # for fav_id in favourites_of_user:
            #     favourite_roars.append(models.Favourite.objects.get(roar_id=fav_id, user_id=request.user))
            favourite_roars = models.Roar.objects.filter(id__in=[roar_id for roar_id in favourites_of_user])
            return render(request, 'roary/favourites.html', {'User': request.user, 'favourite_roars':favourite_roars})
        # except(Exception):
        #     print('Favourites could not be loaded')
        #     return redirect('/')
    else:
        return redirect('/')


def get_roarys(request):
    if request.is_ajax:
        likes_list = list(models.Favourite.objects.values_list('roar_id', flat=True))
        favourites_of_user = list(models.Favourite.objects.filter(user=request.user).values_list('roar_id', flat=True))
        existing_roars = models.Roar.objects.all().order_by('-timestamp')
        for roar in existing_roars:
            roar.amount_of_likes = likes_list.count(roar.id)
            if roar.id in favourites_of_user:
                roar.liked = True
            else:
                roar.liked = False

        json_data = []
        for roar in existing_roars:
            json_data.append({
                "id": roar.id,
                "author": roar.author.username,
                "text": roar.text,
                "timestamp": roar.timestamp.strftime('%B %d, %Y %I:%M %p'),
                "liked": roar.liked,
                "amount_of_likes": roar.amount_of_likes
            })
        dump = json.dumps(json_data)
        return HttpResponse(dump, content_type='application/json')