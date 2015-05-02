from django import forms

from todo import models

class TodoForm(forms.ModelForm):
    class Meta:
        model = models.Todo
        fields = ['description', 'status']

class SetStatusForm(forms.Form):
    id = forms.IntegerField()
    view_status = forms.CharField()
    status = forms.CharField()