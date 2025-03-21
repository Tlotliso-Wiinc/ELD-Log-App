"""
URL configuration for eld project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from .views import index

urlpatterns = [
    path("api/", include("eldapp.urls")),
    path('admin/', admin.site.urls),
    path("", index, name="index"),
    re_path(r"^trips/$", index),
    re_path(r"^trips(?:.*)/?$", index),
    re_path(r"^profile/$", index),
    re_path(r"^profile(?:.*)/?$", index),
    re_path(r"^trip(?:.*)/?$", index),
]

# Serve static files from the /static/ URL prefix
urlpatterns += static('/static/', document_root=settings.STATIC_ROOT)

# Serve media files from the /media/ URL prefix
urlpatterns += static('/media/', document_root=settings.MEDIA_ROOT)
