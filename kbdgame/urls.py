from django.conf.urls import patterns, include, url
from kbdgame import views

urlpatterns = patterns('',
    url(r'^kbd$', views.kbd),
    url(r'^start$', views.start),
    url(r'^check$', views.check),
    url(r'^finish$', views.finish),
)