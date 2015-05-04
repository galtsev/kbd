import json

from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

from todo import models, forms

# Create your views here.

def list(request):
    status = request.GET.get('status', 'in process')
    tasks = models.Todo.objects
    if status!='all':
        tasks = tasks.filter(status=status)
    tasks = tasks.order_by('-date_created')
    form = forms.TodoForm()
    return render(request, 'todo/list.html', {'view_status': status, 'tasks': tasks, 'form': form})


def list_json(request):
    status = request.GET.get('status', 'in process')
    tasks = models.Todo.objects
    if status!='all':
        tasks = tasks.filter(status=status)
    tasks = tasks.order_by('-date_created')
    data = serializers.serialize('json', tasks)
    return HttpResponse(data, content_type="application/json")    


def add_new(request):
    form = forms.TodoForm(request.POST)
    if form.is_valid():
        form.save()
    return redirect('/todo/list')

@csrf_exempt
def add_todo(request):
    data = json.loads(request.body)
    todo = models.Todo(**data)
    todo.save()
    resp = serializers.serialize('json', [todo])
    return HttpResponse(resp, content_type='application/json')

@csrf_exempt
def set_status(request):
    data = json.loads(request.body);
    task = models.Todo.objects.get(pk=data['id'])
    task.status = data['status']
    task.full_clean()
    task.save()
    return HttpResponse('OK', content_type='text/plain')

def test_me(request):
    return HttpResponse('resp from srv', content_type='text/plain')
