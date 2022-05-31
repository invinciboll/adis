from django.template.defaulttags import url
from django.urls import path
from . import views

app_name = 'roary'

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.user_login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.user_logout, name='logout'),
    path('add_favourite/<int:roar_id>', views.add_favourite, name='add_favourite'),
    path('remove_favourite/<int:roar_id>', views.remove_favourite, name='remove_favourite'),
]
