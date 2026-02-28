from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TipoHabitacionViewSet, HabitacionViewSet

# ROUTER VIEWSET
router = DefaultRouter() 
# Registrar en el router los endpoints que queremos
router.register(r'tipos-habitacion', TipoHabitacionViewSet, basename='tipos-habitacion') 
router.register(r'habitaciones', HabitacionViewSet, basename='habitaciones')

urlpatterns = router.urls
# urlpatterns = [
#    # Agrega tus rutas aquí
# ]


