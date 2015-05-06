import json

from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

from todo import models, forms

# Create your views here.


def list_json(request):
    status = request.GET.get('status', 'in process')
    tasks = models.Todo.objects
    if status!='all':
        tasks = tasks.filter(status=status)
    tasks = tasks.order_by('-date_updated')
    data = serializers.serialize('json', tasks)
    return HttpResponse(data, content_type="application/json")    


@csrf_exempt
def add_todo(request):
    data = json.loads(request.body)
    todo = models.Todo(**data)
    todo.save()
    resp = serializers.serialize('json', [todo])
    return HttpResponse(resp, content_type='application/json')


@csrf_exempt
def set_status(request):
    data = json.loads(request.body)
    task = models.Todo.objects.get(pk=data['id'])
    task.status = data['status']
    task.full_clean()
    task.save()
    return HttpResponse('OK', content_type='text/plain')


@csrf_exempt
def delete_task(request):
    data = json.loads(request.body)
    models.Todo.objects.filter(pk=data['id']).delete()
    return HttpResponse('OK', content_type='text/plain')


def test_me(request):
    return HttpResponse('resp from srv', content_type='text/plain')
