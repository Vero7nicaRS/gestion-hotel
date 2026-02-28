from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TipoHabitacionViewSet, HabitacionViewSet, TipoSalaViewSet, SalaViewSet, ClienteViewSet, ReservaViewSet, ReservaSalaViewSet, ReservaHabitacionViewSet

# ROUTER VIEWSET
router = DefaultRouter() 
router.register(r'tipo_habitacion', TipoHabitacionViewSet, basename='tipo_habitacion') # Registrar en el router los endpoints que queremos
router.register(r'habitacion', HabitacionViewSet, basename='habitacion')

urlpatterns = router.urls
# urlpatterns = [
#    # Agrega tus rutas aquí
# ]


