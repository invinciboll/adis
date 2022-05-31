from django import forms
from .models import Roar
from crispy_forms.helper import FormHelper

class RoarForm(forms.ModelForm):
    class Meta:
         model = Roar
         fields = ('text',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = 'post'
