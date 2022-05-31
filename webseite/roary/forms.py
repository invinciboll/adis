from django import forms
from .models import Roar

class RoarForm(forms.ModelForm):
    class Meta:
         model = Roar
         fields = ('text',)
