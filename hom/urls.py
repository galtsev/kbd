from django.conf.urls import patterns, include, url
from hom import views

urlpatterns = patterns('',
    url(r'^home$', views.home),
    url(r'^clock$', views.clock),
    url(r'^get_time$', views.get_time),
)