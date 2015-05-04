from django.conf.urls import patterns, include, url
from django.views.generic.base import TemplateView
from todo import views

urlpatterns = patterns('',
    url(r'^list$', TemplateView.as_view(template_name="todo/list.html")),
    url(r'^add_new$', views.add_new),
    url(r'^set-status$', views.set_status),
    url(r'^test_me$', views.test_me),
    url(r'^test$', TemplateView.as_view(template_name="todo/test.html")),
    url(r'^list_json$', views.list_json),
    url(r'^add_todo$', views.add_todo),
)