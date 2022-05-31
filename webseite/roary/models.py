from django.db import models
from django.contrib.auth.models import User

# ids are created automatically by django

class Roar(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(max_length=280)
    timestamp = models.DateTimeField(auto_now_add=True)


class Favourite(models.Model):
    roar = models.ForeignKey(Roar, on_delete=models.CASCADE,)
    user = models.ForeignKey(User, on_delete=models.CASCADE,)
    


