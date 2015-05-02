from django.conf.urls import patterns, include, url
from todo import views

urlpatterns = patterns('',
    url(r'^list$', views.list),
    url(r'^add_new$', views.add_new),
    url(r'^set-status$', views.set_status),
)