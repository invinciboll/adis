from django.db import models

# Create your models here.
class User(models.Model):
    user = models.ForeignKey(User)
    id = models.AutoField()



