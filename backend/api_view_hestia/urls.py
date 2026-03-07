from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import SalaViewSet, TipoSalaViewSet

# ROUTER VIEWSET
router = DefaultRouter() 

router.register(r'salas', SalaViewSet, basename='salas')
router.register(r'tipo-salas', TipoSalaViewSet, basename='tipo-salas')

urlpatterns = router.urls


