from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static 
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
...

schema_view = get_schema_view(
   openapi.Info(
      title="Food Classification API",
      default_version='v1',
      description="API for food classification",
      contact=openapi.Contact(email="dillawarnwl@gmail.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
)


urlpatterns = [
    path('doc/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('admin/', admin.site.urls),
    path('classifier/', include('classifier.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)