from django.conf.urls import patterns, include, url
from django.views.generic.base import RedirectView
from django.contrib import admin
import kbdgame.urls
import hom.urls
import todo.urls
import boots.urls

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'kbd.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', RedirectView.as_view(url='/hom/home')),
    url(r'^game/', include(kbdgame.urls)),
    url(r'^hom/', include(hom.urls)),
    url(r'^todo/', include(todo.urls)),
    url(r'^boots/', include(boots.urls)),
)
