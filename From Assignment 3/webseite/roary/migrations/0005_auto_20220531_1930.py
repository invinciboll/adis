# Generated by Django 3.2.5 on 2022-05-31 17:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('roary', '0004_favourite'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='roar',
            name='author',
        ),
        migrations.DeleteModel(
            name='Favourite',
        ),
        migrations.DeleteModel(
            name='Roar',
        ),
    ]