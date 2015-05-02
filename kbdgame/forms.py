from django import forms

class StartForm(forms.Form):
    name = forms.CharField(label='name', required=True)