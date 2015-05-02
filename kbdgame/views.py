from random import randint
import json
from datetime import datetime, timedelta
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from kbdgame import forms

# Create your views here.
def make_choice():
    return randint(0, 11)


def kbd(request):
    params = {
        'name': request.session.get('name', 'anonymous'),
        'expect': request.session.get('expect'),
    }
    return render(request, 'kbdgame/kbd.html', params)


@csrf_exempt
def check(request):
    data = json.loads(request.body)
    if data['v'] == request.session['expect']:
        request.session['count'] = request.session['count'] + 1
        request.session['expect'] = make_choice()
        return JsonResponse({'status': 'OK', 'expect': request.session['expect']})
    else:
        return JsonResponse({'status': 'ERR'})


def start(request):
    if request.method == "POST":
        form = forms.StartForm(request.POST)
        if form.is_valid():
            request.session['name'] = form.cleaned_data['name']
            request.session['start_date'] = datetime.utcnow()
            request.session['count'] = 0
            request.session['expect'] = make_choice()
            return redirect('kbdgame.views.kbd')
        else:
            return render(request, 'kbdgame/start.html', {'form': form})
    else:
        form = forms.StartForm()
        return render(request, 'kbdgame/start.html', {'form': form})


def finish(request):
    duration = (datetime.utcnow()-request.session['start_date']).total_seconds()
    stats = {
        'name': request.session['name'],
        'count': request.session['count'],
        'duration': duration,
        'avg': duration/request.session['count'],
    }
    return render(request, 'kbdgame/finish.html', stats)