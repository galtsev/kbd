from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from boots import views

urlpatterns = patterns('',
    url(r'^home$', TemplateView.as_view(template_name="boots/index.html")),
    url(r'^simple$', TemplateView.as_view(template_name="boots/simple.html")),
)