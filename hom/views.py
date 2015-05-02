from datetime import datetime
from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def home(request):
    return render(request, "hom/home.html")


def clock(request):
    return render(request, "hom/clock.html")


def get_time(request):
    return HttpResponse(datetime.now().strftime("%H:%M:%S"), content_type="text/plain")
